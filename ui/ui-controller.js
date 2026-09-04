export class UIController {
    constructor() {
        this.authOverlay = document.getElementById('authOverlay');
        this.reportPanel = document.getElementById('reportPanel');
        this.storyModal = document.getElementById('storyModal');
        this.openReportBtn = document.getElementById('openReportPanelBtn');
        this.logoutBtn = document.getElementById('logoutBtn');
    }

    setAuthenticatedState(isAuthenticated) {
        if (isAuthenticated) {
            this.authOverlay.style.display = 'none';
            this.openReportBtn.style.display = 'block';
            this.logoutBtn.style.display = 'block';
        } else {
            this.authOverlay.style.display = 'flex';
            this.openReportBtn.style.display = 'none';
            this.logoutBtn.style.display = 'none';
            this.reportPanel.style.display = 'none';
        }
    }

    toggleReportPanel() {
        const isHidden = this.reportPanel.style.display === 'none' || this.reportPanel.style.display === '';
        this.reportPanel.style.display = isHidden ? 'flex' : 'none';
    }

    openStoryModal(reportData) {
        document.getElementById('modalCategory').innerText = reportData.category;
        document.getElementById('modalImage').src = reportData.photoUrl;
        document.getElementById('modalVotes').innerText = reportData.upvotes;
        this.storyModal.style.display = 'flex';
    }

    closeStoryModal() {
        this.storyModal.style.display = 'none';
    }
}