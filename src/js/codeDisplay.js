// ============================================
// Code Display Module - Prism.js Integration
// ============================================

import Prism from 'prismjs';

// Import Prism themes and languages
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-csharp';

/**
 * Code examples for the Sunset Hills algorithm
 */
export const CODE_EXAMPLES = {
  javascript: {
    name: 'JavaScript',
    icon: 'fa-brands fa-js',
    code: `/**
 * Determines which buildings can see the sunset.
 * Time Complexity: O(n)
 * Space Complexity: O(1) excluding result array
 * 
 * @param {number[]} heights - Array of building heights
 * @returns {number[]} - Indices of buildings with sunset view
 */
function solveSunsetHills(heights) {
  if (!heights || heights.length === 0) {
    return [];
  }

  const result = [];
  let maxHeight = 0;

  // Scan from right to left (east to west)
  for (let i = heights.length - 1; i >= 0; i--) {
    if (heights[i] > maxHeight) {
      result.unshift(i); // Add to front to maintain order
      maxHeight = heights[i];
    }
  }

  return result;
}

// Example usage
const buildings = [71, 55, 50, 65, 95, 68, 28, 34, 14];
const sunsetView = solveSunsetHills(buildings);
console.log(sunsetView); // [0, 4, 5, 7, 8]`,
  },

  python: {
    name: 'Python',
    icon: 'fa-brands fa-python',
    code: `def solve_sunset_hills(heights):
    """
    Determines which buildings can see the sunset.
    Time Complexity: O(n)
    Space Complexity: O(1) excluding result list
    
    Args:
        heights: List of building heights
    
    Returns:
        List of indices of buildings with sunset view
    """
    if not heights:
        return []
    
    result = []
    max_height = 0
    
    # Scan from right to left (east to west)
    for i in range(len(heights) - 1, -1, -1):
        if heights[i] > max_height:
            result.insert(0, i)  # Add to front to maintain order
            max_height = heights[i]
    
    return result


# Example usage
buildings = [71, 55, 50, 65, 95, 68, 28, 34, 14]
sunset_view = solve_sunset_hills(buildings)
print(sunset_view)  # [0, 4, 5, 7, 8]`,
  },

  java: {
    name: 'Java',
    icon: 'fa-brands fa-java',
    code: `import java.util.*;

public class SunsetHills {
    /**
     * Determines which buildings can see the sunset.
     * Time Complexity: O(n)
     * Space Complexity: O(1) excluding result list
     * 
     * @param heights Array of building heights
     * @return List of indices of buildings with sunset view
     */
    public static List<Integer> solveSunsetHills(int[] heights) {
        List<Integer> result = new ArrayList<>();
        
        if (heights == null || heights.length == 0) {
            return result;
        }
        
        int maxHeight = 0;
        
        // Scan from right to left (east to west)
        for (int i = heights.length - 1; i >= 0; i--) {
            if (heights[i] > maxHeight) {
                result.add(0, i); // Add to front to maintain order
                maxHeight = heights[i];
            }
        }
        
        return result;
    }
    
    public static void main(String[] args) {
        int[] buildings = {71, 55, 50, 65, 95, 68, 28, 34, 14};
        List<Integer> sunsetView = solveSunsetHills(buildings);
        System.out.println(sunsetView); // [0, 4, 5, 7, 8]
    }
}`,
  },

  csharp: {
    name: 'C#',
    icon: 'fa-solid fa-code',
    code: `using System;
using System.Collections.Generic;

public class SunsetHills
{
    /// <summary>
    /// Determines which buildings can see the sunset.
    /// Time Complexity: O(n)
    /// Space Complexity: O(1) excluding result list
    /// </summary>
    /// <param name="heights">Array of building heights</param>
    /// <returns>List of indices of buildings with sunset view</returns>
    public static List<int> SolveSunsetHills(int[] heights)
    {
        var result = new List<int>();
        
        if (heights == null || heights.Length == 0)
        {
            return result;
        }
        
        int maxHeight = 0;
        
        // Scan from right to left (east to west)
        for (int i = heights.Length - 1; i >= 0; i--)
        {
            if (heights[i] > maxHeight)
            {
                result.Insert(0, i); // Add to front to maintain order
                maxHeight = heights[i];
            }
        }
        
        return result;
    }
    
    public static void Main()
    {
        int[] buildings = { 71, 55, 50, 65, 95, 68, 28, 34, 14 };
        var sunsetView = SolveSunsetHills(buildings);
        Console.WriteLine(string.Join(", ", sunsetView)); // 0, 4, 5, 7, 8
    }
}`,
  },
};

/**
 * Initializes Prism.js syntax highlighting
 */
export function initCodeDisplay() {
  // Get all code language tabs
  const languageTabs = document.querySelectorAll('[data-language]');
  const codeDisplay = document.getElementById('codeDisplay');

  if (!codeDisplay) {
    console.error('Code display element not found');
    return;
  }

  // Set initial language (JavaScript)
  displayCode('javascript');

  // Add click handlers to language tabs
  languageTabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const language = tab.getAttribute('data-language');

      // Update active tab
      languageTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      // Display code for selected language
      displayCode(language);
    });
  });

  console.log('Code display initialized with Prism.js');
}

/**
 * Displays code for a specific language
 * @param {string} language - Language key
 */
function displayCode(language) {
  const codeDisplay = document.getElementById('codeDisplay');
  const example = CODE_EXAMPLES[language];

  if (!example || !codeDisplay) {
    console.error('Invalid language or code display element');
    return;
  }

  // Set the code content
  const languageClass = language === 'csharp' ? 'language-csharp' : `language-${language}`;
  
  codeDisplay.innerHTML = `<pre><code class="${languageClass}">${escapeHtml(
    example.code
  )}</code></pre>`;

  // Re-highlight with Prism
  Prism.highlightAll();
}

/**
 * Escapes HTML to prevent XSS
 * @param {string} html - HTML string to escape
 * @returns {string} - Escaped HTML
 */
function escapeHtml(html) {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

/**
 * Copies code to clipboard
 * @param {string} language - Language key
 */
export function copyCode(language) {
  const example = CODE_EXAMPLES[language];

  if (!example) {
    console.error('Invalid language');
    return;
  }

  navigator.clipboard
    .writeText(example.code)
    .then(() => {
      // Show success message (if toast is available)
      if (window.showSuccess) {
        window.showSuccess('Code copied to clipboard!');
      } else {
        alert('Code copied to clipboard!');
      }
    })
    .catch((err) => {
      console.error('Failed to copy code:', err);
      if (window.showError) {
        window.showError('Failed to copy code.');
      }
    });
}
