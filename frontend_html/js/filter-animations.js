/**
 * Filter Animation & Interactions
 * Enhances filter sections with animations and visual feedback
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeFilterAnimations();
});

/**
 * Initialize all filter animations
 */
function initializeFilterAnimations() {
    setupFilterContainers();
    setupFilterToggleAnimations();
    setupFilterOptionAnimations();
    setupFilterRangeSliders();
    setupFilterChips();
    setupFilterSectionExpandCollapse();
}

/**
 * Set up filter containers with entrance animations
 */
function setupFilterContainers() {
    const filterSections = document.querySelectorAll('.filter-section');
    if (!filterSections.length) return;

    // Add entrance animation when scrolled into view
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    filterSections.forEach((section, index) => {
        // Add animation delay based on index for staggered entrance
        section.style.transitionDelay = `${index * 75}ms`;
        observer.observe(section);
    });
}

/**
 * Set up filter toggle button animations
 */
function setupFilterToggleAnimations() {
    const filterToggles = document.querySelectorAll('.filter-toggle, .filter-dropdown-toggle');
    if (!filterToggles.length) return;

    filterToggles.forEach(toggle => {
        // Add ripple effect on click
        toggle.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            ripple.className = 'filter-toggle-ripple';
            
            const rect = toggle.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height) * 2;
            
            ripple.style.width = `${size}px`;
            ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
            
            toggle.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Toggle active class for styling
            toggle.classList.toggle('active');
        });
    });
}

/**
 * Set up filter option animations
 */
function setupFilterOptionAnimations() {
    const filterOptions = document.querySelectorAll('.filter-option, .filter-checkbox-item, .filter-radio-item');
    if (!filterOptions.length) return;

    filterOptions.forEach(option => {
        // Add highlight animation on hover
        option.addEventListener('mouseenter', () => {
            option.classList.add('hover');
        });
        
        option.addEventListener('mouseleave', () => {
            option.classList.remove('hover');
        });
        
        // Add selection animation
        option.addEventListener('click', (e) => {
            // Don't trigger animation if clicking on a checkbox or radio input directly
            if (e.target.tagName === 'INPUT') return;
            
            const isCheckbox = option.querySelector('input[type="checkbox"]');
            const isRadio = option.querySelector('input[type="radio"]');
            
            // Add pulse animation
            const pulse = document.createElement('span');
            pulse.className = 'filter-option-pulse';
            option.appendChild(pulse);
            
            setTimeout(() => {
                pulse.remove();
            }, 400);
            
            // Handle custom checkboxes and radios
            if (isCheckbox) {
                const checkbox = isCheckbox;
                checkbox.checked = !checkbox.checked;
                option.classList.toggle('selected', checkbox.checked);
                
                // Trigger change event
                const event = new Event('change', { bubbles: true });
                checkbox.dispatchEvent(event);
            } else if (isRadio) {
                const radio = isRadio;
                radio.checked = true;
                
                // Update all options in the group
                const name = radio.getAttribute('name');
                document.querySelectorAll(`input[type="radio"][name="${name}"]`).forEach(r => {
                    r.closest('.filter-radio-item').classList.toggle('selected', r === radio);
                });
                
                // Trigger change event
                const event = new Event('change', { bubbles: true });
                radio.dispatchEvent(event);
            } else {
                // For non-input options, toggle selected state
                option.classList.toggle('selected');
            }
        });
    });
}

/**
 * Set up animated range sliders
 */
function setupFilterRangeSliders() {
    const rangeSliders = document.querySelectorAll('.filter-range-slider input[type="range"]');
    if (!rangeSliders.length) return;

    rangeSliders.forEach(slider => {
        // Create visual elements if they don't exist
        const sliderContainer = slider.closest('.filter-range-slider');
        
        if (!sliderContainer.querySelector('.range-progress')) {
            const progress = document.createElement('div');
            progress.className = 'range-progress';
            sliderContainer.appendChild(progress);
        }
        
        if (!sliderContainer.querySelector('.range-thumb')) {
            const thumb = document.createElement('div');
            thumb.className = 'range-thumb';
            sliderContainer.appendChild(thumb);
        }
        
        if (!sliderContainer.querySelector('.range-value')) {
            const value = document.createElement('div');
            value.className = 'range-value';
            value.textContent = slider.value;
            sliderContainer.appendChild(value);
        }
        
        // Update visuals on input
        const progress = sliderContainer.querySelector('.range-progress');
        const thumb = sliderContainer.querySelector('.range-thumb');
        const valueDisplay = sliderContainer.querySelector('.range-value');
        
        function updateRangeVisuals() {
            const min = parseFloat(slider.min) || 0;
            const max = parseFloat(slider.max) || 100;
            const val = parseFloat(slider.value);
            const percentage = ((val - min) / (max - min)) * 100;
            
            progress.style.width = `${percentage}%`;
            thumb.style.left = `${percentage}%`;
            valueDisplay.textContent = slider.value;
            valueDisplay.style.left = `${percentage}%`;
            
            // Add active class during interaction
            sliderContainer.classList.add('active');
        }
        
        // Initial setup
        updateRangeVisuals();
        
        // Update on input
        slider.addEventListener('input', updateRangeVisuals);
        
        // Remove active class when done
        slider.addEventListener('change', () => {
            setTimeout(() => {
                sliderContainer.classList.remove('active');
            }, 500);
        });
    });
}

/**
 * Set up filter chips with animations
 */
function setupFilterChips() {
    const filterChips = document.querySelectorAll('.filter-chip');
    if (!filterChips.length) return;

    filterChips.forEach(chip => {
        // Add remove button if it doesn't exist
        if (!chip.querySelector('.chip-remove')) {
            const removeBtn = document.createElement('button');
            removeBtn.className = 'chip-remove';
            removeBtn.setAttribute('aria-label', 'Remove filter');
            removeBtn.innerHTML = '×';
            chip.appendChild(removeBtn);
            
            // Add event listener for remove button
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                // Add removal animation
                chip.classList.add('removing');
                
                // Remove after animation completes
                setTimeout(() => {
                    chip.remove();
                }, 300);
            });
        }
        
        // Add click animation
        chip.addEventListener('click', () => {
            chip.classList.add('clicked');
            
            setTimeout(() => {
                chip.classList.remove('clicked');
            }, 300);
        });
    });
}

/**
 * Set up filter section expand/collapse animations
 */
function setupFilterSectionExpandCollapse() {
    const filterSectionHeaders = document.querySelectorAll('.filter-section-header');
    if (!filterSectionHeaders.length) return;

    filterSectionHeaders.forEach(header => {
        const section = header.closest('.filter-section');
        const content = section.querySelector('.filter-section-content');
        
        // Add toggle indicator if it doesn't exist
        if (!header.querySelector('.section-toggle-icon')) {
            const toggleIcon = document.createElement('span');
            toggleIcon.className = 'section-toggle-icon material-symbols-rounded';
            toggleIcon.textContent = 'expand_more';
            header.appendChild(toggleIcon);
        }
        
        // Set up click handler
        header.addEventListener('click', () => {
            const isExpanded = section.classList.contains('expanded');
            
            // Toggle expanded state
            section.classList.toggle('expanded', !isExpanded);
            
            // Animate content height
            if (content) {
                if (isExpanded) {
                    content.style.height = `${content.scrollHeight}px`;
                    
                    // Trigger reflow
                    content.offsetHeight;
                    
                    content.style.height = '0px';
                } else {
                    content.style.height = `${content.scrollHeight}px`;
                    
                    // Reset height after transition
                    setTimeout(() => {
                        content.style.height = '';
                    }, 300);
                }
            }
            
            // Update ARIA attributes
            header.setAttribute('aria-expanded', !isExpanded);
            if (content) {
                content.setAttribute('aria-hidden', isExpanded);
            }
            
            // Rotate toggle icon
            const toggleIcon = header.querySelector('.section-toggle-icon');
            if (toggleIcon) {
                toggleIcon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
            }
        });
        
        // Set initial state (collapsed by default on mobile)
        if (window.innerWidth < 768 && !section.classList.contains('expanded')) {
            if (content) {
                content.style.height = '0px';
                content.setAttribute('aria-hidden', 'true');
            }
            
            header.setAttribute('aria-expanded', 'false');
        } else {
            section.classList.add('expanded');
            header.setAttribute('aria-expanded', 'true');
            if (content) {
                content.setAttribute('aria-hidden', 'false');
            }
        }
    });
}
