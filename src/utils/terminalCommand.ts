
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
        return { output: ['Available commands: help, clear, ls, cd <path>, about, work, contact'] };
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

    if (command === 'work') {
        return { output: ['  Check out my projects at /work or type "projects" for a list.'] };
    }

    if (command === 'contact') {
        return { output: ['  Reach me at: contact@example.com'] };
    }

    return { output: [`  Command not found: ${cmd}. Type "help" for available commands.`] };
};
