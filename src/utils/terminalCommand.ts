
export interface CommandResult {
    output: string[];
    shouldClear?: boolean;
    navigationPath?: string;
}

export const processCommand = (cmd: string): CommandResult => {
    if (!cmd.trim()) return { output: [] };

    const parts = cmd.trim().split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (command === 'clear') {
        return { output: [], shouldClear: true };
    }

    if (command === 'help') {
        return {
            output: [
                '┌─────────────────────────────────────────────────────────┐',
                '│  Available Commands                                     │',
                '├─────────────────────────────────────────────────────────┤',
                '│  help              Show this help message               │',
                '│  clear             Clear the terminal screen            │',
                '│  ls                List all available paths             │',  
                '│  cd <path>         Navigate to a page (e.g. cd /about)  │',
                '│  about             Learn about me                       │',
                '│  projects          View my projects                     │',
                '│  contact           Get my contact information           │',
                '│  start             Quick start guide for visitors       │',
                '│  experiences       View my experiences                  │',
                '└─────────────────────────────────────────────────────────┘',
            ]
        };
    }

    if (command === 'start' || command === 'getting-started') {
        return {
            output: [
                '',
                '  🚀 Welcome to my interactive portfolio!',
                '',
                '  Quick Navigation:',
                '    • Type "cd /about" to learn about me',
                '    • Type "cd /projects" to see my public work',
                '    • Type "cd /experiences" to view my journey',
                '    • Type "cd /contact" to get in touch',
                '',
                '  Tips:',
                '    • Use the CHAT tab to ask me anything!',
                '    • Drag the floating cards on the home page',
                '    • Type "help" for all available commands',
                '',
            ]
        };
    }

    if (command === 'ls') {
        return {
            output: [
                'The available paths are:',
                '  /about         - Learn more about my journey',
                '  /projects      - Browse my recent work',
                '  /experiences   - View my skills and history',
                '  /contact       - Get in touch',
            ]
        };
    }

    if (command === 'cd') {
        if (args.length === 0) {
            return { output: ['Usage: cd <path> (e.g., cd /about)'] };
        }
        const path = args[0];
        const validPaths = ['/about', '/projects', '/experiences', '/contact', '/'];

        if (validPaths.includes(path)) {
            return {
                output: [`Navigating to ${path}...`],
                navigationPath: path
            };
        } else {
            return { output: [`cd: no such file or directory: ${path}`] };
        }
    }

    if (command === 'about') {
        return { output: ['  Hello! I am Twan! I am a software developer who passionate to software development and AI applications'] };
    }

    if (command === 'projects') {
        return { output: ['  Check out my projects at /projects by typing "cd /projects"'] };
    }

    if (command === 'experiences') {
        return { output: ['  Check out my experiences at /experiences by typing "cd /experiences"'] };
    }

    if (command === 'contact') {
        return { output: ['  Reach me at: contact@example.com'] };
    }

    return { output: [`  Command not found: ${cmd}. Type "help" for available commands.`] };
};
