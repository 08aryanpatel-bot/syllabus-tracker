
document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // PART 1: DASHBOARD LOGIC (index.html)
    // ==========================================
    const overallCircle = document.querySelector('.circular-progress');
    
    if (overallCircle) {
        let grandTotalMarks = 0;
        let grandTotalCompletedChapters = 0;
        let grandTotalAllChapters = 0;

        // 1. Function to calculate marks for one part
        function getPartMarks(prefix, totalChapters, partMarks) {
            let completed = 0;
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(prefix) && localStorage.getItem(key) === 'true') {
                    completed++;
                }
            }
            let earnedMarks = totalChapters > 0 ? (partMarks / totalChapters) * completed : 0;
            return { marks: earnedMarks, chaptersDone: completed };
        }

        // 2. Function to update a Subject Card
        function updateSubjectCard(partsMenu, fillClass, textClass, marksClass) {
            let subjectEarnedMarks = 0;
            let subjectTotalMarks = 0;
            let subjectCompletedChapters = 0;
            let subjectTotalChapters = 0;

            partsMenu.forEach(part => {
                let result = getPartMarks(part.prefix, part.totalCh, part.marks);
                subjectEarnedMarks += result.marks;
                subjectCompletedChapters += result.chaptersDone;
                subjectTotalMarks += part.marks;
                subjectTotalChapters += part.totalCh;
            });

            let percentage = subjectTotalMarks > 0 ? Math.round((subjectEarnedMarks / subjectTotalMarks) * 100) : 0;

            const fillBar = document.querySelector(fillClass);
            const percentText = document.querySelector(textClass);
            const marksBadge = document.querySelector(marksClass);
            
            if (fillBar) fillBar.style.width = percentage + '%';
            if (percentText) percentText.innerText = percentage + '%';
            if (marksBadge) marksBadge.innerText = `${Math.round(subjectEarnedMarks)}/80 Marks`;

            grandTotalMarks += Math.round(subjectEarnedMarks);
        }

        // --- SUBJECT DEFINITIONS ---
        const scienceParts = [
            { prefix: 'sci-phy-', totalCh: 4, marks: 25 },
            { prefix: 'sci-chem-', totalCh: 5, marks: 25 },
            { prefix: 'sci-bio-', totalCh: 4, marks: 30 }
        ];
        updateSubjectCard(scienceParts, '.science-fill', '.sci-percent', '.sci-marks');

        const mathParts = [
            { prefix: 'math-u1-', totalCh: 1, marks: 6 },
            { prefix: 'math-u2-', totalCh: 4, marks: 20 },
            { prefix: 'math-u3-', totalCh: 1, marks: 6 },
            { prefix: 'math-u4-', totalCh: 2, marks: 15 },
            { prefix: 'math-u5-', totalCh: 2, marks: 12 },
            { prefix: 'math-u6-', totalCh: 2, marks: 10 },
            { prefix: 'math-u7-', totalCh: 2, marks: 11 }
        ];
        updateSubjectCard(mathParts, '.maths-fill', '.maths-percent', '.math-marks');

        const sstParts = [
            { prefix: 'sst-his-', totalCh: 5, marks: 20 },
            { prefix: 'sst-geo-', totalCh: 7, marks: 20 },
            { prefix: 'sst-pol-', totalCh: 5, marks: 20 },
            { prefix: 'sst-eco-', totalCh: 5, marks: 20 }
        ];
        updateSubjectCard(sstParts, '.sst-fill', '.sst-percent', '.sst-marks');

        const englishParts = [
            { prefix: 'eng-ff-', totalCh: 9, marks: 20 },
            { prefix: 'eng-fwf-', totalCh: 9, marks: 20 },
            { prefix: 'eng-read-', totalCh: 1, marks: 20 },
            { prefix: 'eng-wg-', totalCh: 7, marks: 20 }
        ];
        updateSubjectCard(englishParts, '.english-fill', '.english-percent', '.english-marks');

        const hindiParts = [
            { prefix: 'hin-ksh-', totalCh: 12, marks: 15 },
            { prefix: 'hin-kri-', totalCh: 3, marks: 15 },
            { prefix: 'hin-read-', totalCh: 1, marks: 14},
            { prefix: 'hin-wg-', totalCh: 8, marks: 36}
        ];
        updateSubjectCard(hindiParts, '.hindi-fill', '.hindi-percent', '.hindi-marks');

        // --- UPDATE BIG CIRCLE ---
        let overallPercentage = Math.round((grandTotalMarks / 500) * 100);
        const circleText = document.querySelector('.inner-circle h2');
        if (circleText) circleText.innerText = overallPercentage + '%';
        
        overallCircle.style.background = `conic-gradient(#58cc9c 0% ${overallPercentage}%, #d1e9ff ${overallPercentage}% 100%)`;

        const overallMarksElement = document.getElementById('overall-marks-text');
        if (overallMarksElement) overallMarksElement.innerText = `${grandTotalMarks} / 500 marks`;
    }

    // ==========================================
    // PART 2: SUBJECT PAGE LOGIC (maths.html, etc.)
    // ==========================================
    const checkboxes = document.querySelectorAll('.chapter-card input[type="checkbox"]');
    const subjectProgressFill = document.querySelector('.progress-fill'); 
    const subjectProgressText = document.querySelector('.subject-progress span'); 

    if (checkboxes.length > 0 && subjectProgressFill) {
        const chapterWeights = {
            'sci-phy-': 25 / 4, 'sci-chem-': 25 / 5, 'sci-bio-': 30 / 4,
            'math-u1-': 6 / 1, 'math-u2-': 20 / 4, 'math-u3-': 6 / 1, 'math-u4-': 15 / 2, 'math-u5-': 12 / 2, 'math-u6-': 10 / 2, 'math-u7-': 11 / 2,
            'sst-his-': 20 / 5, 'sst-geo-': 20 / 7, 'sst-pol-': 20 / 5, 'sst-eco-': 20 / 5,
            'eng-ff-': 20 / 9, 'eng-fwf-': 20 / 9, 'eng-read-': 20 / 1, 'eng-wg-': 20 / 7,
            'hin-ksh-': 15 / 12, 'hin-kri-': 15 / 3, 'hin-read-': 14 / 1, 'hin-wg-': 36 / 8
        };

        checkboxes.forEach(box => {
            if (box.id && localStorage.getItem(box.id) === 'true') box.checked = true;
        });

        function updateSubjectPageProgress() {
            let totalMarksEarned = 0;
            checkboxes.forEach(box => {
                if (box.checked) {
                    for (let prefix in chapterWeights) {
                        if (box.id.startsWith(prefix)) {
                            totalMarksEarned += chapterWeights[prefix];
                            break;
                        }
                    }
                }
            });

            let percentage = Math.round((totalMarksEarned / 80) * 100);
            
            // --- THE FIX: This line moves the bar on the detail pages! ---
            subjectProgressFill.style.width = percentage + '%';
            if (subjectProgressText) subjectProgressText.innerText = percentage + '% Completed';
        }

        updateSubjectPageProgress();

        checkboxes.forEach(box => {
            box.addEventListener('change', () => {
                localStorage.setItem(box.id, box.checked);
                updateSubjectPageProgress();
            });
        });
    }

    // ==========================================
    // PART 3: RESET PROGRESS (With Warning)
    // ==========================================
    const resetBtn = document.getElementById('reset-btn');

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            // The Warning ⚠️
            const confirmReset = confirm("⚠️ WARNING: This will erase ALL your study progress. Are you sure you want to start fresh?");
            
            if (confirmReset) {
                // Clear everything from the browser's memory
                localStorage.clear();
                
                // Refresh the page to show 0% everywhere
                window.location.reload();
            }
        });
    }

    // ==========================================
    // PART 4: NOTIFICATION DOT & MILESTONES
    // ==========================================
    const notifBtn = document.getElementById('notif-btn');
    const notifDot = document.getElementById('notif-dot');

    // 1. Logic to show the dot on new milestones
    // We check if current percentage is higher than the last "seen" milestone
    let lastSeenMilestone = localStorage.getItem('lastMilestone') || 0;
    let currentMilestone = Math.floor(overallPercentage / 10) * 10;

    if (currentMilestone > lastSeenMilestone && currentMilestone > 0) {
        if (notifDot) notifDot.style.display = 'block';
    }

    // 2. Click logic to hide the dot and show the alert
    if (notifBtn) {
        notifBtn.addEventListener('click', () => {
            // Hide the dot once clicked
            if (notifDot) notifDot.style.display = 'none';
            localStorage.setItem('lastMilestone', currentMilestone);

            let remaining = 0;
            let milestoneName = "";

            if (overallPercentage < 50) {
                remaining = 250 - grandTotalMarks;
                milestoneName = "the Halfway Mark (50%)";
            } else if (overallPercentage < 80) {
                remaining = 400 - grandTotalMarks;
                milestoneName = "the Distinction Mark (80%)";
            } else {
                remaining = 500 - grandTotalMarks;
                milestoneName = "Total Victory (100%)";
            }

            alert(`🔔 MILESTONE UNLOCKED: You are at ${overallPercentage}%!\n\nOnly ${remaining} marks left until ${milestoneName}. Keep that momentum!`);
        });
    }
});
