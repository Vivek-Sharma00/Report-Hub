import { AuthService } from './services/auth-service.js';
import { ReportService } from './services/report-service.js';
import { MapController } from './ui/map-controller.js';
import { UIController } from './ui/ui-controller.js'; // Ensure you update UIController to handle userProfile display

class Application {
    constructor() {
        this.authService = new AuthService();
        this.reportService = new ReportService();
        this.mapController = new MapController('map');
        this.uiController = new UIController();
        this.isSignUpMode = false;
        this.currentUser = null;
        
        this.initEventListeners();
        this.setupAuthObserver();
        
        // Start syncing data immediately for PUBLIC view
        this.startDataSync(); 
    }

    initEventListeners() {
        // UI Dropdown Logic for "Other" Category
        document.getElementById('reportCategory').addEventListener('change', (e) => {
            document.getElementById('customCategoryText').style.display = e.target.value === 'CUSTOM_OTHER' ? 'block' : 'none';
        });

        document.getElementById('authPrimaryBtn').addEventListener('click', () => this.handleAuth());
        document.getElementById('authToggleLink').addEventListener('click', () => this.toggleAuthMode());
        document.getElementById('logoutBtn').addEventListener('click', () => this.authService.logout());
        document.getElementById('openReportPanelBtn').addEventListener('click', () => this.uiController.toggleReportPanel());
        document.getElementById('cancelReportBtn').addEventListener('click', () => this.uiController.toggleReportPanel());
        document.getElementById('submitReportBtn').addEventListener('click', () => this.handleNewReport());
        document.getElementById('closeModalBtn').addEventListener('click', () => this.uiController.closeStoryModal());
    }

    setupAuthObserver() {
        this.authService.onAuthStateChange((user) => {
            this.currentUser = user;
            if (user) {
                document.getElementById('authOverlay').style.display = 'none';
                document.getElementById('userProfile').style.display = 'block';
                document.getElementById('openReportPanelBtn').style.display = 'block';
                document.getElementById('userEmailDisplay').innerText = user.email;
                document.getElementById('commentFormRow').style.display = 'flex';
            } else {
                document.getElementById('authOverlay').style.display = 'flex';
                document.getElementById('userProfile').style.display = 'none';
                document.getElementById('openReportPanelBtn').style.display = 'none';
                document.getElementById('commentFormRow').style.display = 'none';
            }
        });
    }

    toggleAuthMode() {
        this.isSignUpMode = !this.isSignUpMode;
        document.getElementById('authTitle').innerText = this.isSignUpMode ? "Register Account" : "Sign In to Report Hub";
        document.getElementById('authToggleLink').innerText = this.isSignUpMode ? "Already verified? Log in here" : "New here? Create a public community profile";
    }
    async handleAuth() {
        const email = document.getElementById('authEmail').value.trim();
        const password = document.getElementById('authPassword').value.trim();
        
        if (!email || !password) {
            alert("Don't leave the fields blank.");
            return;
        }

        // Optional UX improvement: Change button text to show loading state
        const btn = document.getElementById('authPrimaryBtn');
        const originalText = btn.innerText;
        btn.innerText = "Authenticating...";
        btn.disabled = true;

        try {
            if (this.isSignUpMode) {
                await this.authService.register(email, password);
            } else {
                await this.authService.login(email, password);
            }
        } catch (error) {
            alert(error.message);
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    }

    startDataSync() {
        this.reportService.subscribeToActiveReports((reports) => {
            this.mapController.updateMapData(reports, (report) => this.openStoryModal(report));
        });
    }

    openStoryModal(report) {
        document.getElementById('modalCategory').innerText = report.category;
        document.getElementById('modalImage').src = report.photoUrl;
        document.getElementById('modalDescription').innerText = report.description || "No description provided.";
        document.getElementById('modalVotes').innerText = report.upvotes;
        
        // SECURITY UI LOGIC: Only show "Mark Solved" if the logged-in user owns the post
        const solveBtn = document.getElementById('solveBtn');
        if (this.currentUser && this.currentUser.uid === report.userId) {
            solveBtn.style.display = 'block';
        } else {
            solveBtn.style.display = 'none';
        }

        document.getElementById('storyModal').style.display = 'flex';
    }

    async handleNewReport() {
        if (!this.currentUser) return alert("You must be logged in to post.");
        
        const categorySelect = document.getElementById('reportCategory').value;
        const finalCategory = categorySelect === 'CUSTOM_OTHER' ? document.getElementById('customCategoryText').value : categorySelect;
        
        if (!finalCategory) return alert("Please specify the custom category.");

        const description = document.getElementById('reportDescription').value;
        const fileInput = document.getElementById('reportFile');

        document.getElementById('loadingIndicator').style.display = 'block';

        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const data = {
                    category: finalCategory,
                    description: description,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                // Pass the currentUser.uid to the service
                await this.reportService.createReport(data, fileInput.files[0], this.currentUser.uid);
                this.mapController.centerOn(data.latitude, data.longitude);
                this.uiController.toggleReportPanel();
            } catch (error) {
                alert("Failed to submit report. Check console.");
            } finally {
                document.getElementById('loadingIndicator').style.display = 'none';
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new Application());