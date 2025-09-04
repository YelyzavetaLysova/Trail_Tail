#!/bin/zsh
# Script to update script tags in all HTML files

# Define the HTML files to process
HTML_FILES=("how-it-works.html" "trail.html" "login.html" "register.html" "dashboard.html" "safety.html")

# The directory where the HTML files are located
HTML_DIR="/Users/yelyzavetalysova/Documents/GitHub/Trail_Tail/frontend_html"

# Process each file
for file in "${HTML_FILES[@]}"; do
    echo "Processing $file..."
    
    # Use sed to replace the script tags section
    # The -i '' is specific to macOS sed to edit files in-place without a backup
    sed -i '' '/<\!-- Services -->/{
    N; N; N; N; N; N; N; N; N; N; N;
    c\
    <!-- Scripts with ES modules -->\
    <script type="module" src="js/main.js"></script>\
    \
    <!-- Utilities that may not be modules yet -->\
    <script src="js/utils/ui.utils.js"></script>\
    <script src="js/utils/map.utils.js"></script>
    }' "$HTML_DIR/$file"
    
    echo "Updated $file"
done

echo "All HTML files have been updated successfully."
