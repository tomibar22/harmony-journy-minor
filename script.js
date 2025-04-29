document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const droppableSlots = document.querySelectorAll('.droppable');
    const iconItems = document.querySelectorAll('.icon-item');
    const resetBtn = document.getElementById('reset-btn');
    
    // Check if we're on a mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // Keep track of placed icons
    const placedIcons = {
        slot1: null,
        slot2: null,
        slot3: null
    };

    // Drag and Drop functionality
    function initDragAndDrop() {
        // Make icons draggable
        iconItems.forEach(item => {
            item.addEventListener('dragstart', handleDragStart);
        });

        // Make slots droppable
        droppableSlots.forEach(slot => {
            slot.addEventListener('dragover', handleDragOver);
            slot.addEventListener('dragleave', handleDragLeave);
            slot.addEventListener('drop', handleDrop);
        });
    }

    function handleDragStart(e) {
        // Store the dragged icon's HTML
        const iconImg = this.querySelector('img');
        const iconClone = iconImg.cloneNode(true);
        iconClone.classList.add('placed-icon');
        e.dataTransfer.setData('text/html', iconClone.outerHTML);
        e.dataTransfer.setData('degree', iconImg.dataset.degree);
    }

    function handleDragOver(e) {
        e.preventDefault(); // Allow drop
        this.classList.add('hover');
    }

    function handleDragLeave(e) {
        this.classList.remove('hover');
    }

    function handleDrop(e) {
        e.preventDefault();
        this.classList.remove('hover');
        
        // If slot already has an icon, remove it first
        if (this.innerHTML !== '') {
            this.innerHTML = '';
            this.classList.remove('filled');
        }
        
        // Add the new icon
        const iconHtml = e.dataTransfer.getData('text/html');
        const degree = e.dataTransfer.getData('degree');
        this.innerHTML = iconHtml;
        this.classList.add('filled');
        
        // Store the placed icon
        const slotId = this.id;
        placedIcons[slotId] = {
            html: iconHtml,
            degree: degree
        };
    }

    function checkJourneyComplete() {
        // Removed play and save functionality
    }
    
    // Reset functionality
    resetBtn.addEventListener('click', () => {
        droppableSlots.forEach(slot => {
            slot.innerHTML = '';
            slot.classList.remove('filled');
        });
        
        // Reset placed icons
        Object.keys(placedIcons).forEach(key => {
            placedIcons[key] = null;
        });
    });

    // Initialize drag and drop
    initDragAndDrop();
    
    // Add touch support for mobile devices
    if (isMobile) {
        addTouchSupport();
    }
    
    // Function to add touch support for mobile devices
    function addTouchSupport() {
        iconItems.forEach(item => {
            item.addEventListener('touchstart', handleTouchStart, { passive: false });
            item.addEventListener('touchmove', handleTouchMove, { passive: false });
            item.addEventListener('touchend', handleTouchEnd, { passive: false });
        });
        
        let touchTarget = null;
        let draggedClone = null;
        let initialX, initialY;
        
        function handleTouchStart(e) {
            e.preventDefault();
            
            // Store the touched item
            touchTarget = this;
            initialX = e.touches[0].clientX;
            initialY = e.touches[0].clientY;
            
            // Create a visual clone for dragging
            const iconImg = touchTarget.querySelector('img');
            draggedClone = document.createElement('div');
            draggedClone.className = 'dragging-clone';
            draggedClone.style.position = 'fixed';
            draggedClone.style.zIndex = '1000';
            draggedClone.style.opacity = '0.8';
            draggedClone.style.pointerEvents = 'none';
            draggedClone.style.width = '60px';
            draggedClone.style.height = '60px';
            draggedClone.style.left = (initialX - 30) + 'px';
            draggedClone.style.top = (initialY - 30) + 'px';
            draggedClone.style.borderRadius = '8px';
            draggedClone.style.backgroundColor = 'var(--surface-color)';
            draggedClone.style.display = 'flex';
            draggedClone.style.justifyContent = 'center';
            draggedClone.style.alignItems = 'center';
            
            const imgClone = iconImg.cloneNode(true);
            imgClone.style.width = '80%';
            imgClone.style.height = '80%';
            draggedClone.appendChild(imgClone);
            document.body.appendChild(draggedClone);
            
            // Mark as dragging
            touchTarget.classList.add('dragging');
        }
        
        function handleTouchMove(e) {
            e.preventDefault();
            if (!touchTarget || !draggedClone) return;
            
            // Move the visual clone
            const touch = e.touches[0];
            draggedClone.style.left = (touch.clientX - 30) + 'px';
            draggedClone.style.top = (touch.clientY - 30) + 'px';
            
            // Detect slot under touch
            const elementUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY);
            const slot = elementUnderTouch?.closest('.droppable');
            
            // Highlight potential drop slot
            droppableSlots.forEach(s => s.classList.remove('hover'));
            if (slot) {
                slot.classList.add('hover');
            }
        }
        
        function handleTouchEnd(e) {
            e.preventDefault();
            if (!touchTarget) return;
            
            // Remove clone
            if (draggedClone) {
                document.body.removeChild(draggedClone);
                draggedClone = null;
            }
            
            // Get touch position
            const touch = e.changedTouches[0];
            const elementUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY);
            
            // Check if we're over a droppable slot
            const slot = elementUnderTouch?.closest('.droppable');
            
            if (slot) {
                // Get the icon info from the dragged element
                const iconImg = touchTarget.querySelector('img');
                const iconClone = iconImg.cloneNode(true);
                iconClone.classList.add('placed-icon');
                const degree = iconImg.dataset.degree;
                
                // If slot already has an icon, remove it first
                if (slot.innerHTML !== '') {
                    slot.innerHTML = '';
                    slot.classList.remove('filled');
                }
                
                // Add the new icon
                slot.innerHTML = iconClone.outerHTML;
                slot.classList.add('filled');
                slot.classList.remove('hover');
                
                // Store the placed icon
                const slotId = slot.id;
                placedIcons[slotId] = {
                    html: iconClone.outerHTML,
                    degree: degree
                };
            }
            
            // Remove all hover states
            droppableSlots.forEach(s => s.classList.remove('hover'));
            touchTarget.classList.remove('dragging');
            touchTarget = null;
        }
    }
});