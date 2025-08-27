// Git processing utilities for online version

// GitHub API integration
export const fetchGitHubCommits = async (githubUrl) => {
  try {
    // Parse GitHub URL to extract owner and repo
    const urlPattern = /github\.com\/([^\/]+)\/([^\/]+)/;
    const match = githubUrl.match(urlPattern);
    
    if (!match) {
      throw new Error('Invalid GitHub URL format. Use: https://github.com/owner/repository');
    }
    
    const [, owner, repo] = match;
    const cleanRepo = repo.replace(/\.git$/, ''); // Remove .git suffix if present
    
    // Fetch commits from GitHub API
    const apiUrl = `https://api.github.com/repos/${owner}/${cleanRepo}/commits?per_page=50`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Repository not found. Make sure the repository exists and is public.');
      } else if (response.status === 403) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const commits = await response.json();
    
    // Process GitHub commits into our format
    return commits.map((commit, index) => {
      const message = commit.commit.message.toLowerCase();
      let type = 'refactor'; // default
      
      // Auto-categorize based on commit message
      if (message.includes('fix') || message.includes('bug') || message.includes('patch')) {
        type = 'bug';
      } else if (message.includes('add') || message.includes('feature') || message.includes('implement') || message.includes('new')) {
        type = 'feature';
      } else if (message.includes('refactor') || message.includes('update') || message.includes('improve') || message.includes('optimize')) {
        type = 'refactor';
      }
      
      return {
        id: commit.sha.substring(0, 8),
        message: commit.commit.message.split('\n')[0], // First line only
        author: commit.commit.author.name,
        date: commit.commit.author.date,
        type: type,
        files: [], // GitHub API doesn't include files in basic commit list
        additions: Math.floor(Math.random() * 100) + 1, // Placeholder
        deletions: Math.floor(Math.random() * 50) + 1,  // Placeholder
        description: generateDescription(commit.commit.message, type)
      };
    });
    
  } catch (error) {
    console.error('GitHub fetch error:', error);
    throw error;
  }
};

// Parse git log text input
export const parseGitLog = (gitLogText) => {
  try {
    const lines = gitLogText.trim().split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      throw new Error('No commit data found in the provided text.');
    }
    
    const commits = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      let commit;
      
      // Try different git log formats
      if (line.includes('|')) {
        // Format: hash|author|date|message
        const parts = line.split('|');
        if (parts.length >= 4) {
          commit = {
            id: parts[0].trim().substring(0, 8),
            author: parts[1].trim(),
            date: parts[2].trim(),
            message: parts.slice(3).join('|').trim()
          };
        }
      } else {
        // Try oneline format: hash message
        const parts = line.split(' ');
        if (parts.length >= 2) {
          const hash = parts[0];
          const message = parts.slice(1).join(' ');
          
          commit = {
            id: hash.substring(0, 8),
            author: 'Unknown', // Not available in oneline format
            date: new Date().toISOString(), // Use current date as fallback
            message: message
          };
        }
      }
      
      if (commit) {
        // Auto-categorize
        const message = commit.message.toLowerCase();
        let type = 'refactor';
        
        if (message.includes('fix') || message.includes('bug') || message.includes('patch')) {
          type = 'bug';
        } else if (message.includes('add') || message.includes('feature') || message.includes('implement') || message.includes('new')) {
          type = 'feature';
        } else if (message.includes('refactor') || message.includes('update') || message.includes('improve') || message.includes('optimize')) {
          type = 'refactor';
        }
        
        commits.push({
          ...commit,
          type: type,
          files: [],
          additions: Math.floor(Math.random() * 100) + 1,
          deletions: Math.floor(Math.random() * 50) + 1,
          description: generateDescription(commit.message, type)
        });
      }
    }
    
    if (commits.length === 0) {
      throw new Error('Could not parse any commits from the provided text. Please check the format.');
    }
    
    return commits;
    
  } catch (error) {
    console.error('Git log parsing error:', error);
    throw error;
  }
};

// Helper function to generate descriptions
const generateDescription = (message, type) => {
  const descriptions = {
    feature: [
      'Added new functionality to enhance user experience',
      'Implemented requested feature for improved workflow',
      'Introduced new capabilities to the system',
      'Expanded feature set with new functionality'
    ],
    bug: [
      'Resolved critical issue affecting system stability',
      'Fixed reported bug to improve reliability',
      'Addressed edge case causing unexpected behavior',
      'Corrected malfunction in system component'
    ],
    refactor: [
      'Improved code structure and maintainability',
      'Optimized performance and reduced complexity',
      'Enhanced code quality through refactoring',
      'Restructured codebase for better organization'
    ]
  };
  
  const typeDescriptions = descriptions[type] || descriptions.refactor;
  
  // Try to generate more specific description based on message content
  if (message.length > 50) {
    return message.substring(0, 80) + (message.length > 80 ? '...' : '');
  }
  
  return typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)];
};

// Validate GitHub URL
export const isValidGitHubUrl = (url) => {
  const pattern = /^https?:\/\/(www\.)?github\.com\/[^\/]+\/[^\/]+/;
  return pattern.test(url);
};

// Extract repo info from GitHub URL
export const parseGitHubUrl = (url) => {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (match) {
    return {
      owner: match[1],
      repo: match[2].replace(/\.git$/, '')
    };
  }
  return null;
};