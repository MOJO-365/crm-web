import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/ui/Tooltip';
import {
    BoldIcon,
    ItalicIcon,
    UnderlineIcon,
    EditorLinkIcon,
    ListIcon,
    OrderedListIcon,
    VariableIcon,
    TableIcon,
    CTAButtonIcon,
    PreviewIcon,
    CodeBracketIcon,
    MaximizeIcon,
    MinimizeIcon
} from '@/components/icons';
import { Select } from '@/components/ui/Select';
import type { SelectOption } from '@/components/ui/Select';


type ViewMode = 'edit' | 'html';


const HEADING_OPTIONS: SelectOption[] = [
    { label: 'Paragraph', value: 'p' },
    { label: 'Heading 1', value: 'h1' },
    { label: 'Heading 2', value: 'h2' },
    { label: 'Heading 3', value: 'h3' },
    { label: 'Heading 4', value: 'h4' },
    { label: 'Heading 5', value: 'h5' },
    { label: 'Heading 6', value: 'h6' },
];

export const SHARED_EDITOR_STYLES = `
    .html-editor-content h1 { font-size: 24px; font-weight: 700; margin: 0.67em 0; line-height: 1.2; color: #111827; }
    .html-editor-content h2 { font-size: 20px; font-weight: 600; margin: 0.83em 0; line-height: 1.25; color: #1f2937; }
    .html-editor-content h3 { font-size: 18px; font-weight: 600; margin: 1em 0; line-height: 1.3; color: #374151; }
    .html-editor-content h4 { font-size: 16px; font-weight: 600; margin: 1em 0; line-height: 1.35; color: #4b5563; }
    .html-editor-content h5 { font-size: 14px; font-weight: 600; margin: 1em 0; line-height: 1.4; color: #6b7280; }
    .html-editor-content h6 { font-size: 13px; font-weight: 600; margin: 1em 0; line-height: 1.4; color: #6b7280; font-style: italic; }
    .html-editor-content p { font-size: 13px; margin: 0.75em 0; line-height: 1.6; color: #374151; }
    .html-editor-content ul { list-style-type: disc; padding-left: 1.5em; margin: 0.75em 0; color: #374151; font-size: 13px; }
    .html-editor-content ol { list-style-type: decimal; padding-left: 1.5em; margin: 0.75em 0; color: #374151; font-size: 13px; }
    .html-editor-content li { margin: 0.25em 0; line-height: 1.5; color: #374151; font-size: 13px; }
    .html-editor-content a { color: #2563eb; text-decoration: underline; font-size: 13px; }
    
    /* Dark Mode Overrides */
    .dark .html-editor-content h1,
    .dark .html-editor-content h2,
    .dark .html-editor-content h3,
    .dark .html-editor-content h4,
    .dark .html-editor-content h5,
    .dark .html-editor-content h6 { color: #f3f4f6 !important; }
    
    .dark .html-editor-content p,
    .dark .html-editor-content ul,
    .dark .html-editor-content ol,
    .dark .html-editor-content li { color: #e5e7eb !important; }
    
    .dark .html-editor-content a { color: #60a5fa !important; }
`;

const FONT_OPTIONS: SelectOption[] = [
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Times New Roman', value: 'Times New Roman, serif' },
    { label: 'Verdana', value: 'Verdana, sans-serif' },
    { label: 'Courier New', value: 'Courier New, monospace' },
    { label: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif' },
    { label: 'Tahoma', value: 'Tahoma, sans-serif' },
    { label: 'Helvetica', value: 'Helvetica, sans-serif' },
];

const FONT_SIZE_OPTIONS: SelectOption[] = [
    { label: '10px', value: '10px' },
    { label: '12px', value: '12px' },
    { label: '13px', value: '13px' },
    { label: '14px', value: '14px' },
    { label: '16px', value: '16px' },
    { label: '18px', value: '18px' },
    { label: '20px', value: '20px' },
    { label: '24px', value: '24px' },
    { label: '30px', value: '30px' },
    { label: '36px', value: '36px' },
];

export interface HtmlEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    placeholders?: { label: string; value: string; description?: string }[];
    className?: string;
    minHeight?: string;
    label?: string;
    helperText?: string;
    error?: string;
    showOfferPageButton?: boolean;
    baseFontSize?: string;
}

export interface HtmlEditorHandle {
    insertHTML: (html: string) => void;
}

interface ToolbarButtonProps {
    icon: React.ReactNode;
    onClick: () => void;
    title: string;
    isActive?: boolean;
    className?: string;
    label?: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ icon, onClick, title, isActive, className, label }) => (
    <Tooltip content={title} position="bottom">
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'p-1.5 rounded transition-all duration-150',
                'hover:bg-gray-100 dark:hover:bg-gray-700',
                'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100',
                'focus:outline-none focus:ring-2 focus:ring-primary/50',
                isActive && 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary border border-primary/50',
                className
            )}
        >
            <span className="flex items-center gap-1">
                {icon}
                {label && <span className="text-xs">{label}</span>}
            </span>
        </button>
    </Tooltip>
);

const ToolbarDivider: React.FC = () => (
    <div className="w-px h-5 bg-gray-200 dark:bg-gray-600 mx-1" />
);

export const HtmlEditor = React.forwardRef<HtmlEditorHandle, HtmlEditorProps>(({
    value,
    onChange,
    placeholder = 'Start typing...',
    placeholders = [
        { label: 'Project No', value: '[[PROJECT_NO]]', description: 'Project number' },
        { label: 'Org Name', value: '[[ORG_NAME]]', description: 'Organization name' },
    ],
    className,
    minHeight = '200px',
    label,
    helperText,
    error,
    showOfferPageButton = true,
    baseFontSize = '13px',
}, ref) => {
    const editorRef = React.useRef<HTMLDivElement>(null);
    const savedSelectionRef = React.useRef<Range | null>(null);
    const placeholderButtonRef = React.useRef<HTMLButtonElement>(null);
    const [viewMode, setViewMode] = React.useState<ViewMode>('edit');
    const [showPlaceholderMenu, setShowPlaceholderMenu] = React.useState(false);
    const [dropdownPosition, setDropdownPosition] = React.useState({ top: 0, left: 0 });
    const [placeholderSearch, setPlaceholderSearch] = React.useState('');
    const [activeFormats, setActiveFormats] = React.useState<Set<string>>(new Set());

    React.useImperativeHandle(ref, () => ({
        insertHTML: (html: string) => {
            if (viewMode !== 'edit') {
                setViewMode('edit');
                // Give some time for the view to switch
                setTimeout(() => {
                    editorRef.current?.focus();
                    restoreSelection();
                    document.execCommand('insertHTML', false, html);
                    handleInput();
                }, 50);
                return;
            }
            editorRef.current?.focus();
            restoreSelection();
            document.execCommand('insertHTML', false, html);
            handleInput();
        }
    }));
    const [currentBlock, setCurrentBlock] = React.useState('p');
    const [currentFont, setCurrentFont] = React.useState('');
    const [currentFontSize, setCurrentFontSize] = React.useState('13px');

    // Link popover state
    const [showLinkPopover, setShowLinkPopover] = React.useState(false);
    const [linkUrl, setLinkUrl] = React.useState('https://');

    // Button popover state
    const [showButtonPopover, setShowButtonPopover] = React.useState(false);
    const [buttonText, setButtonText] = React.useState('Click Here');

    // Fullscreen state
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const [buttonUrl, setButtonUrl] = React.useState('https://');

    // Helper functions for wrapping/unwrapping HTML
    const wrapHtml = (content: string) => {
        if (!content) return '';
        if (content.match(/<html/i)) return content;
        return `<!DOCTYPE html>
<html>
<body>
${content}
</body>
</html>`;
    };

    const unwrapHtml = (content: string) => {
        if (!content) return '';
        // If it contains body tag, extract content
        if (content.match(/<body/i)) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(content, 'text/html');
            return doc.body.innerHTML;
        }
        return content;
    };

    // Helper function to wrap orphan text nodes
    const wrapOrphanTextNodes = () => {
        if (!editorRef.current) return;

        const childNodes = Array.from(editorRef.current.childNodes);
        childNodes.forEach(node => {
            // If it's a text node with actual content
            if (node.nodeType === Node.TEXT_NODE && node.textContent && node.textContent.trim().length > 0) {
                const p = document.createElement('p');
                node.parentNode?.insertBefore(p, node);
                p.appendChild(node);
            }
            // Also check for BR elements at root level
            else if (node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName === 'BR') {
                const p = document.createElement('p');
                node.parentNode?.insertBefore(p, node);
                p.appendChild(node);
            }
        });
    };

    // Clean variables for storage - remove styling spans, keep just [[VAR]]
    const cleanVariablesForStorage = (html: string): string => {
        if (!html) return '';

        // Create a temp element to parse HTML
        const temp = document.createElement('div');
        temp.innerHTML = html;

        // Find all variable spans (contenteditable="false" with [[...]] content)
        const variableSpans = temp.querySelectorAll('span[contenteditable="false"]');
        variableSpans.forEach(span => {
            const text = span.textContent || '';
            // If it looks like a variable [[...]], replace span with just the text
            if (text.match(/^\[\[.+\]\]$/)) {
                const textNode = document.createTextNode(text);
                span.parentNode?.replaceChild(textNode, span);
            }
        });

        return temp.innerHTML;
    };

    // Strip inline styles that we added for storage, so we can compare "clean" HTML
    const stripInternalStyles = (html: string): string => {
        if (!html) return '';
        const temp = document.createElement('div');
        temp.innerHTML = html;

        Object.keys(inlineStylesMap).forEach(tagName => {
            const elements = temp.querySelectorAll(tagName.toLowerCase());
            elements.forEach(el => {
                const htmlEl = el as HTMLElement;
                const style = htmlEl.getAttribute('style') || '';
                // Simple regex to remove our standard styles if they exist
                // This is safer than just removing the whole style attribute
                let cleanedStyle = style;
                const internalStyle = inlineStylesMap[tagName];
                // Remove the internal style from the start if it matches
                if (cleanedStyle.includes(internalStyle)) {
                    cleanedStyle = cleanedStyle.replace(internalStyle, '').trim();
                }

                if (cleanedStyle) {
                    htmlEl.setAttribute('style', cleanedStyle);
                } else {
                    htmlEl.removeAttribute('style');
                }
            });
        });

        return temp.innerHTML;
    };

    // Inline styles map for each element type - applied when saving to database
    const inlineStylesMap: Record<string, string> = {
        'H1': 'font-size: 24px; font-weight: 700; margin: 0.67em 0; line-height: 1.2; color: #111827;',
        'H2': 'font-size: 20px; font-weight: 600; margin: 0.83em 0; line-height: 1.25; color: #1f2937;',
        'H3': 'font-size: 18px; font-weight: 600; margin: 1em 0; line-height: 1.3; color: #374151;',
        'H4': 'font-size: 16px; font-weight: 600; margin: 1em 0; line-height: 1.35; color: #4b5563;',
        'H5': 'font-size: 14px; font-weight: 600; margin: 1em 0; line-height: 1.4; color: #6b7280;',
        'H6': 'font-size: 13px; font-weight: 600; margin: 1em 0; line-height: 1.4; color: #6b7280; font-style: italic;',
        'P': 'font-size: 13px; margin: 0.75em 0; line-height: 1.6; color: #374151;',
        'UL': 'list-style-type: disc; padding-left: 1.5em; margin: 0.75em 0; color: #374151; font-size: 13px;',
        'OL': 'list-style-type: decimal; padding-left: 1.5em; margin: 0.75em 0; color: #374151; font-size: 13px;',
        'LI': 'margin: 0.25em 0; line-height: 1.5; color: #374151; font-size: 13px;',
    };

    // Add inline styles to HTML elements for database storage
    const addInlineStylesToHtml = (html: string): string => {
        if (!html) return '';

        const temp = document.createElement('div');
        temp.innerHTML = html;

        // Apply inline styles to all matching elements
        Object.keys(inlineStylesMap).forEach(tagName => {
            const elements = temp.querySelectorAll(tagName.toLowerCase());
            elements.forEach(el => {
                const htmlEl = el as HTMLElement;
                // Preserve existing styles and add our styles
                // We prepend our styles so that existing styles (like explicit colors) take precedence
                const existingStyle = htmlEl.getAttribute('style') || '';
                if (existingStyle) {
                    // Check if existing style already defines things we want to set
                    // This is a simple check; a more robust one would involve parsing styles
                    const hasColor = existingStyle.includes('color:');
                    const hasFontSize = existingStyle.includes('font-size:');

                    let stylesToAdd = inlineStylesMap[tagName];
                    if (hasColor) stylesToAdd = stylesToAdd.replace(/color:[^;]+;?/g, '');
                    if (hasFontSize) stylesToAdd = stylesToAdd.replace(/font-size:[^;]+;?/g, '');

                    htmlEl.setAttribute('style', `${stylesToAdd.trim()} ${existingStyle.trim()}`);
                } else {
                    htmlEl.setAttribute('style', inlineStylesMap[tagName]);
                }
            });
        });

        return temp.innerHTML;
    };

    // Style variables for display - convert [[VAR]] to styled spans
    // IMPORTANT: Only style variables in text content, NOT in attributes (like href)
    const styleVariablesForDisplay = (html: string): string => {
        if (!html) return '';

        // Use DOM parsing to only replace variables in text nodes, not attributes
        const temp = document.createElement('div');
        temp.innerHTML = html;

        // Recursive function to process text nodes
        const processNode = (node: Node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent || '';
                // Check if this text contains variables
                if (text.includes('[[') && text.includes(']]')) {
                    // Create a temporary container for the replacement
                    const fragment = document.createDocumentFragment();
                    const parts = text.split(/(\[\[[^\]]+\]\])/g);

                    parts.forEach(part => {
                        if (part.match(/^\[\[[^\]]+\]\]$/)) {
                            // This is a variable - create styled span
                            const span = document.createElement('span');
                            span.style.cssText = 'display: inline; background-color: #dbeafe; color: #1d4ed8; padding: 2px 6px; margin: 0 2px; border-radius: 4px; font-size: 0.875rem; font-weight: 500; border: 1px solid #bfdbfe; white-space: nowrap;';
                            span.contentEditable = 'false';
                            span.textContent = part;
                            fragment.appendChild(span);
                        } else if (part) {
                            // Regular text
                            fragment.appendChild(document.createTextNode(part));
                        }
                    });

                    // Replace the text node with the fragment
                    node.parentNode?.replaceChild(fragment, node);
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // Process child nodes (make a copy of childNodes since we're modifying)
                Array.from(node.childNodes).forEach(child => processNode(child));
            }
        };

        processNode(temp);
        return temp.innerHTML;
    };

    // Initialize editor content - only on mount and view mode changes
    React.useEffect(() => {
        if (editorRef.current && viewMode === 'edit') {
            // Only set content if the editor doesn't have focus (not actively editing)
            const isFocused = document.activeElement === editorRef.current;

            if (!isFocused) {
                if (value) {
                    let bodyContent = unwrapHtml(value);
                    // Style plain variables for display
                    bodyContent = styleVariablesForDisplay(bodyContent);

                    // Check if content actually changed to avoid cursor jumps/resets
                    // We compare against clean content to avoid false mismatches caused by inline styles or variables
                    const currentClean = stripInternalStyles(cleanVariablesForStorage(editorRef.current.innerHTML));
                    const incomingClean = stripInternalStyles(cleanVariablesForStorage(bodyContent));

                    if (currentClean !== incomingClean) {
                        editorRef.current.innerHTML = bodyContent;
                        // Wrap any orphan text that might be in the loaded content
                        wrapOrphanTextNodes();
                    }
                } else {
                    // Ensure default empty state is a paragraph
                    editorRef.current.innerHTML = '<p><br></p>';
                }
            }

            // Force paragraph mode for new lines - this is critical for clean HTML
            // It ensures that pressing Enter creates <p> tags instead of <div>
            document.execCommand('defaultParagraphSeparator', false, 'p');
        }
    }, [viewMode, value]); // added value to support async updates

    // Update active formats on selection change
    const updateActiveFormats = React.useCallback(() => {
        const formats = new Set<string>();
        if (document.queryCommandState('bold')) formats.add('bold');
        if (document.queryCommandState('italic')) formats.add('italic');
        if (document.queryCommandState('underline')) formats.add('underline');
        if (document.queryCommandState('insertOrderedList')) formats.add('ol');

        setActiveFormats(formats);

        // Update block state
        const blockValue = document.queryCommandValue('formatBlock');
        setCurrentBlock(blockValue ? blockValue.toLowerCase() : 'p');

        // Update font state
        const fontValue = document.queryCommandValue('fontName');
        // Strip quotes if present (some browsers return "Arial" with quotes)
        const cleanFont = fontValue ? fontValue.replace(/['"]/g, '') : '';
        setCurrentFont(cleanFont);

        // Update font size state
        // We look for font-size in the style of the current selection
        let size = baseFontSize || '13px';
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const container = range.collapsed ? range.startContainer : range.commonAncestorContainer;
            const element = container.nodeType === Node.ELEMENT_NODE ? (container as HTMLElement) : container.parentElement;
            
            if (element) {
                const computedStyle = window.getComputedStyle(element);
                const computedSize = computedStyle.fontSize;
                
                if (computedSize) {
                    // Normalize computed size (e.g., "13.333px" -> "13px")
                    const match = computedSize.match(/^([\d.]+)(px|rem|em|pt)$/);
                    if (match) {
                        const value = parseFloat(match[1]);
                        const unit = match[2];
                        
                        if (unit === 'px') {
                            const roundedPx = Math.round(value) + 'px';
                            // Check if the rounded value matches any of our dropdown options
                            if (FONT_SIZE_OPTIONS.some(opt => opt.value === roundedPx)) {
                                size = roundedPx;
                            } else {
                                // If no exact match (e.g. 13.33px -> 13px), try to find the closest option if needed
                                // but for now, we'll just use the rounded value if it exists in options
                                size = roundedPx;
                            }
                        } else {
                            size = computedSize;
                        }
                    }
                }
            }
        }
        setCurrentFontSize(size);

        // ALWAYS save selection on candidate change
        saveSelection();
    }, []);

    React.useEffect(() => {
        document.addEventListener('selectionchange', updateActiveFormats);
        return () => document.removeEventListener('selectionchange', updateActiveFormats);
    }, [updateActiveFormats]);

    // Handle content changes
    const handleInput = () => {
        if (editorRef.current) {
            // Wrap any orphan text nodes
            wrapOrphanTextNodes();

            let html = editorRef.current.innerHTML;

            // Check if the editor is visually empty and reset to a clean paragraph
            if (html === '' || html === '<br>') {
                html = '<p><br></p>';
                editorRef.current.innerHTML = html;
            }

            // Clean variables for storage (remove styling, keep just [[VAR]])
            let cleanedHtml = cleanVariablesForStorage(html);

            // Add inline styles to HTML elements for database storage
            cleanedHtml = addInlineStylesToHtml(cleanedHtml);

            onChange(wrapHtml(cleanedHtml));
        }
    };

    // Execute formatting commands
    const execCommand = (command: string, value?: string) => {
        editorRef.current?.focus();
        restoreSelection();
        document.execCommand(command, false, value);
        handleInput();
        updateActiveFormats();
    };

    // Toolbar actions
    const handleBold = () => execCommand('bold');
    const handleItalic = () => execCommand('italic');
    const handleUnderline = () => execCommand('underline');
    const handleOrderedList = () => execCommand('insertOrderedList');
    const handleUnorderedList = () => execCommand('insertUnorderedList');

    const handleColor = (color: string) => {
        execCommand('foreColor', color);
    };

    const handleFontSize = (size: string) => {
        if (!size) return;

        editorRef.current?.focus();
        restoreSelection();

        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);

            if (range.collapsed) {
                // If no selection, we can't easily apply font size via span
                // Standard execCommand is limited, so we'll just return for now
                // or we could insert a span with a zero-width space
                return;
            }

            // Wrap selection in a span with font-size
            // Use execCommand('fontSize', ...) as a fallback or just manual manipulation
            // Pixels are better for our PDF preview consistency
            const span = document.createElement('span');
            span.style.fontSize = size;
            
            try {
                // Extract contents and wrap
                const contents = range.extractContents();
                span.appendChild(contents);
                range.insertNode(span);
                
                // Select the new node
                selection.removeAllRanges();
                const newRange = document.createRange();
                newRange.selectNodeContents(span);
                selection.addRange(newRange);
                
                saveSelection();
                handleInput();
                setCurrentFontSize(size);
            } catch (e) {
                console.error('Failed to apply font size:', e);
            }
        }
    };

    const handleLink = () => {
        saveSelection();
        setShowLinkPopover(true);
    };

    const insertLink = () => {
        if (linkUrl && linkUrl !== 'https://' && editorRef.current) {
            editorRef.current.focus();
            restoreSelection();
            document.execCommand('createLink', false, linkUrl);
            handleInput();
        }
        setShowLinkPopover(false);
        setLinkUrl('https://');
    };

    const handleHeading = (level: string) => {
        if (!level) return;
        execCommand('formatBlock', `<${level}>`);
    };

    // Insert table
    const handleTable = () => {
        if (!editorRef.current) return;
        
        editorRef.current.focus();
        restoreSelection();

        const tableHtml = `
<table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
    <tr>
        <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5;">Header 1</th>
        <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5;">Header 2</th>
        <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5;">Header 3</th>
    </tr>
    <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Cell 1</td>
        <td style="border: 1px solid #ddd; padding: 8px;">Cell 2</td>
        <td style="border: 1px solid #ddd; padding: 8px;">Cell 3</td>
    </tr>
    <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Cell 4</td>
        <td style="border: 1px solid #ddd; padding: 8px;">Cell 5</td>
        <td style="border: 1px solid #ddd; padding: 8px;">Cell 6</td>
    </tr>
</table><p></p>`;
        document.execCommand('insertHTML', false, tableHtml);
        handleInput();
    };

    // Save current selection/cursor position
    const saveSelection = () => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            // Only save if cursor is inside the editor
            if (editorRef.current?.contains(range.commonAncestorContainer)) {
                savedSelectionRef.current = range.cloneRange();
            }
        }
    };

    // Restore saved selection
    const restoreSelection = (): boolean => {
        const selection = window.getSelection();
        if (savedSelectionRef.current && selection && editorRef.current) {
            try {
                selection.removeAllRanges();
                selection.addRange(savedSelectionRef.current);
                return true;
            } catch (e) {
                console.warn('Failed to restore selection:', e);
            }
        }
        return false;
    };

    // Insert placeholder at cursor (inline, no new lines)
    const insertPlaceholder = (placeholder: string) => {
        if (!editorRef.current) return;

        editorRef.current.focus();

        // Try to restore the saved selection
        const restored = restoreSelection();

        // Create the placeholder element
        const span = document.createElement('span');
        span.style.cssText = 'display: inline; background-color: #dbeafe; color: #1d4ed8; padding: 2px 6px; margin: 0 2px; border-radius: 4px; font-size: 0.875rem; font-weight: 500; border: 1px solid #bfdbfe; white-space: nowrap;';
        span.contentEditable = 'false';
        span.textContent = placeholder;

        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);

            // Delete any selected content first
            range.deleteContents();

            // Insert the placeholder span
            range.insertNode(span);

            // Move cursor after the inserted element
            range.setStartAfter(span);
            range.setEndAfter(span);
            selection.removeAllRanges();
            selection.addRange(range);
        } else if (!restored) {
            // Fallback: append to end if no selection
            editorRef.current.appendChild(span);
        }

        handleInput();
        setShowPlaceholderMenu(false);
        setPlaceholderSearch('');
    };

    // Insert a styled button
    const handleButton = () => {
        saveSelection();
        setShowButtonPopover(true);
    };

    const insertButton = () => {
        if (buttonText && buttonUrl && buttonUrl !== 'https://' && editorRef.current) {
            restoreSelection();
            editorRef.current.focus();

            // Create an email-compatible button using inline styles
            const buttonHtml = `<a href="${buttonUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 10px 20px; margin: 8px 0; border-radius: 6px; text-decoration: none; font-weight: 500; font-size: 14px;" target="_blank">${buttonText}</a>`;

            document.execCommand('insertHTML', false, buttonHtml);
            handleInput();
        }
        setShowButtonPopover(false);
        setButtonText('Click Here');
        setButtonUrl('https://');
    };

    // Filter placeholders based on search
    const filteredPlaceholders = placeholders.filter(p =>
        p.label.toLowerCase().includes(placeholderSearch.toLowerCase()) ||
        p.value.toLowerCase().includes(placeholderSearch.toLowerCase())
    );

    // Close all popovers on outside click
    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            if (showPlaceholderMenu && !target.closest('.placeholder-menu-container')) {
                setShowPlaceholderMenu(false);
            }
            if (showLinkPopover && !target.closest('.link-popover-container')) {
                setShowLinkPopover(false);
            }
            if (showButtonPopover && !target.closest('.button-popover-container')) {
                setShowButtonPopover(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showPlaceholderMenu, showLinkPopover, showButtonPopover]);

    // Handle paste - clean up pasted HTML
    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
        handleInput();
    };

    const containerClasses = cn(
        'rounded-lg border border-input bg-background',
        error && 'border-destructive',
        className
    );

    const renderToolbar = () => (
        <div 
            className="flex flex-wrap items-center gap-0.5 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-t-lg"
            onMouseDown={(e) => {
                // Prevent focus theft unless clicking an input
                const target = e.target as HTMLElement;
                if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && !target.closest('input') && !target.closest('textarea')) {
                    e.preventDefault();
                }
            }}
        >
            {viewMode === 'edit' && (
                <>
                    {/* Heading/Paragraph Selector */}
                    {/* Heading/Paragraph Selector */}
                    <div className="w-32">
                        <Select
                            options={HEADING_OPTIONS}
                            value={currentBlock}
                            onChange={(val) => handleHeading(val as string)}
                            placeholder="Paragraph"
                            className="h-7 text-xs py-1"
                        />
                    </div>

                    {/* Font Family Selector */}
                    <div className="w-36">
                        <Select
                            options={FONT_OPTIONS}
                            value={currentFont}
                            onChange={(val) => {
                                if (val) {
                                    execCommand('fontName', val as string);
                                    // Update state immediately for better UX
                                    setCurrentFont(val as string);
                                }
                            }}
                            placeholder="Font"
                            className="h-7 text-xs py-1"
                        />
                    </div>

                    {/* Font Size Selector */}
                    <div className="w-24">
                        <Select
                            options={FONT_SIZE_OPTIONS}
                            value={currentFontSize}
                            onChange={(val) => handleFontSize(val as string)}
                            placeholder="Size"
                            className="h-7 text-xs py-1"
                        />
                    </div>

                    <ToolbarDivider />

                    {/* Text Formatting */}
                    <ToolbarButton
                        icon={<BoldIcon />}
                        onClick={handleBold}
                        title="Bold (Ctrl+B)"
                        isActive={activeFormats.has('bold')}
                    />
                    <ToolbarButton
                        icon={<ItalicIcon />}
                        onClick={handleItalic}
                        title="Italic (Ctrl+I)"
                        isActive={activeFormats.has('italic')}
                    />
                    <ToolbarButton
                        icon={<UnderlineIcon />}
                        onClick={handleUnderline}
                        title="Underline (Ctrl+U)"
                        isActive={activeFormats.has('underline')}
                    />

                    <ToolbarDivider />

                    {/* Text Color */}
                    <div className="flex items-center gap-1 px-1">
                        <Tooltip content="Primary Color (#68c645)">
                            <button
                                type="button"
                                onClick={() => handleColor('#68c645')}
                                className="w-5 h-5 rounded-full border border-gray-200 dark:border-gray-600 hover:scale-110 transition-transform flex items-center justify-center overflow-hidden"
                                style={{ backgroundColor: '#68c645' }}
                            />
                        </Tooltip>
                        <Tooltip content="Black Color (#000000)">
                            <button
                                type="button"
                                onClick={() => handleColor('#000000')}
                                className="w-5 h-5 rounded-full border border-gray-200 dark:border-gray-600 hover:scale-110 transition-transform flex items-center justify-center overflow-hidden"
                                style={{ backgroundColor: '#000000' }}
                            />
                        </Tooltip>
                    </div>

                    <ToolbarDivider />

                    {/* Lists */}
                    <ToolbarButton
                        icon={<ListIcon />}
                        onClick={handleUnorderedList}
                        title="Bullet List"
                        isActive={activeFormats.has('ul')}
                    />
                    <ToolbarButton
                        icon={<OrderedListIcon />}
                        onClick={handleOrderedList}
                        title="Numbered List"
                        isActive={activeFormats.has('ol')}
                    />

                    <ToolbarDivider />

                    {/* Link with Popover */}
                    <div className="relative link-popover-container">
                        <ToolbarButton
                            icon={<EditorLinkIcon />}
                            onClick={handleLink}
                            title="Insert Link"
                            isActive={showLinkPopover}
                        />
                        {showLinkPopover && (
                            <div className="absolute left-0 top-full mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-[9999] p-3">
                                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Insert Link</div>
                                <input
                                    type="url"
                                    placeholder="https://..."
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-primary mb-2"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            insertLink();
                                        } else if (e.key === 'Escape') {
                                            setShowLinkPopover(false);
                                        }
                                    }}
                                />
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowLinkPopover(false)}
                                        className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={insertLink}
                                        className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-primary rounded hover:bg-primary-hover"
                                    >
                                        Insert
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Button with Popover */}
                    <div className="relative button-popover-container">
                        <ToolbarButton
                            icon={<CTAButtonIcon />}
                            onClick={handleButton}
                            title="Insert CTA Button"
                            isActive={showButtonPopover}
                        />
                        {showButtonPopover && (
                            <div className="absolute left-0 top-full mt-1 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-[9999] p-3">
                                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Insert Button</div>
                                <input
                                    type="text"
                                    placeholder="Button text"
                                    value={buttonText}
                                    onChange={(e) => setButtonText(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-primary mb-2"
                                    autoFocus
                                />
                                <input
                                    type="url"
                                    placeholder="https://..."
                                    value={buttonUrl}
                                    onChange={(e) => setButtonUrl(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-primary mb-2"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            insertButton();
                                        } else if (e.key === 'Escape') {
                                            setShowButtonPopover(false);
                                        }
                                    }}
                                />
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowButtonPopover(false)}
                                        className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={insertButton}
                                        className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-primary rounded hover:bg-primary-hover"
                                    >
                                        Insert
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Table */}
                    <ToolbarButton
                        icon={<TableIcon />}
                        onClick={handleTable}
                        title="Insert Table"
                    />

                    <ToolbarDivider />

                    {/* Offer Page Button - Static button for offer page redirection */}
                    {showOfferPageButton && (
                        <Tooltip content="Insert Offer Page Button" position="bottom">
                            <button
                                type="button"
                                onClick={() => {
                                    if (editorRef.current) {
                                        editorRef.current.focus();
                                        // Create an email-compatible button for offer page with customer ID variable
                                        const offerButtonHtml = `<p></p><table border="0" cellpadding="0" cellspacing="0" style="margin: 16px 0;"><tr><td align="center" bgcolor="#638C1C" style="border-radius: 6px; background-color: #638C1C;"><a href="${window.location.origin}/?offer=[[CUSTOMER_ID]]" style="display: inline-block; padding: 12px 24px; font-size: 14px; font-weight: 600; color: #ffffff !important; text-decoration: none !important; border-radius: 6px; background-color: #638C1C;" target="_blank">View Your Offer</a></td></tr></table><p></p>`;
                                        document.execCommand('insertHTML', false, offerButtonHtml);
                                        handleInput();
                                    }
                                }}
                                className={cn(
                                    "flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded border transition-colors",
                                    "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
                                    "border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300",
                                    "hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-900/30 dark:hover:to-teal-900/30"
                                )}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                <span>Offer Page</span>
                            </button>
                        </Tooltip>
                    )}
                </>
            )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Insert Variable Button - Show in both modes but only works in Edit for now unless we enhance it */}
            {viewMode === 'edit' && (
                <div className="relative placeholder-menu-container">
                    <Tooltip content="Insert Variable (Shortcut: type [[ or Ctrl+Shift+V)" position="bottom">
                        <button
                            ref={placeholderButtonRef}
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                saveSelection(); // Save cursor position before opening menu
                                // Calculate position for the dropdown
                                if (placeholderButtonRef.current) {
                                    const rect = placeholderButtonRef.current.getBoundingClientRect();
                                    setDropdownPosition({
                                        top: rect.bottom + window.scrollY + 4,
                                        left: rect.right - 288 + window.scrollX, // 288 = w-72 (18rem)
                                    });
                                }
                                setShowPlaceholderMenu(!showPlaceholderMenu);
                            }}
                            className={cn(
                                "flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded border transition-colors",
                                showPlaceholderMenu
                                    ? "bg-primary/10 dark:bg-primary/20 border-primary/30 dark:border-primary/40 text-primary dark:text-primary"
                                    : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                            )}
                        >
                            <VariableIcon size={14} />
                            <span>Insert Variable</span>
                            <span className="ml-1 px-1 py-0.5 bg-gray-100 dark:bg-gray-600 rounded text-[10px] text-gray-500 dark:text-gray-400 font-mono">[[</span>
                        </button>
                    </Tooltip>

                    {/* Placeholder Dropdown - rendered via portal */}
                    {showPlaceholderMenu && createPortal(
                        <div
                            className="fixed w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-[99999]"
                            style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
                        >
                            {/* Search Input */}
                            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                                <input
                                    type="text"
                                    placeholder="Search Variable..."
                                    value={placeholderSearch}
                                    onChange={(e) => setPlaceholderSearch(e.target.value)}
                                    className="w-full px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-primary"
                                    autoFocus
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>

                            {/* Placeholder List */}
                            <div className="max-h-64 overflow-y-auto p-1">
                                {filteredPlaceholders.length > 0 ? (
                                    filteredPlaceholders.map((p) => (
                                        <button
                                            key={p.value}
                                            type="button"
                                            className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                insertPlaceholder(p.value);
                                            }}
                                        >
                                            <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                                [{p.label}]
                                            </div>
                                            {p.description && (
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                    {p.description}
                                                </div>
                                            )}
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-3 py-4 text-center text-sm text-gray-500">
                                        No variables found
                                    </div>
                                )}
                            </div>
                        </div>,
                        document.body
                    )}
                </div>
            )}

            {viewMode === 'edit' && <ToolbarDivider />}

            {/* View Mode Tabs */}
            <div className="flex items-center gap-1 px-2">
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
                    <Tooltip content="Edit Mode (Preview)" position="bottom">
                        <button
                            type="button"
                            onClick={() => setViewMode('edit')}
                            className={cn(
                                "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all",
                                viewMode === 'edit'
                                    ? "bg-white dark:bg-gray-600 text-primary shadow-sm"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            )}
                        >
                            <PreviewIcon size={14} />
                        </button>
                    </Tooltip>
                    <Tooltip content="HTML Source Code" position="bottom">
                        <button
                            type="button"
                            onClick={() => setViewMode('html')}
                            className={cn(
                                "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all",
                                viewMode === 'html'
                                    ? "bg-white dark:bg-gray-600 text-primary shadow-sm"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            )}
                        >
                            <CodeBracketIcon size={14} />
                        </button>
                    </Tooltip>
                </div>

                <ToolbarDivider />

                {/* Fullscreen Toggle */}
                <ToolbarButton
                    icon={isFullscreen ? <MinimizeIcon /> : <MaximizeIcon />}
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                    isActive={isFullscreen}
                />
            </div>
        </div>
    );

    // Handle keyboard shortcuts for variable insertion
    const handleEditorKeyDown = (e: React.KeyboardEvent) => {
        // Ctrl+Shift+V - Open variable menu
        if (e.ctrlKey && e.shiftKey && e.key === 'V') {
            e.preventDefault();
            saveSelection();
            openVariableMenuAtCursor(true); // Open at text cursor
            return;
        }

        // Track [[ pattern for quick variable insertion
        if (e.key === '[') {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const textNode = range.startContainer;
                if (textNode.nodeType === Node.TEXT_NODE) {
                    const text = textNode.textContent || '';
                    const offset = range.startOffset;
                    // Check if previous character is also [
                    if (offset > 0 && text[offset - 1] === '[') {
                        e.preventDefault();
                        // Remove the first [ from content
                        const newText = text.slice(0, offset - 1) + text.slice(offset);
                        textNode.textContent = newText;
                        // Set cursor position
                        range.setStart(textNode, offset - 1);
                        range.setEnd(textNode, offset - 1);
                        selection.removeAllRanges();
                        selection.addRange(range);
                        saveSelection();
                        openVariableMenuAtCursor(true); // Open at text cursor
                        return;
                    }
                }
            }
        }
    };

    // Open variable menu at current cursor position
    const openVariableMenuAtCursor = (atTextCursor = false) => {
        if (atTextCursor) {
            // Try to get cursor position in the editor
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                if (rect.width !== 0 || rect.height !== 0) {
                    setDropdownPosition({
                        top: rect.bottom + window.scrollY + 4,
                        left: Math.max(rect.left + window.scrollX, 10), // Ensure it doesn't go off-screen
                    });
                    setShowPlaceholderMenu(true);
                    setPlaceholderSearch('');
                    return;
                }
            }
        }
        // Fallback to button position
        if (placeholderButtonRef.current) {
            const rect = placeholderButtonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY + 4,
                left: rect.right - 288 + window.scrollX,
            });
        }
        setShowPlaceholderMenu(true);
        setPlaceholderSearch('');
    };

    const renderEditor = () => (
        <div className="html-editor-content bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 h-full">
            <style>{SHARED_EDITOR_STYLES}</style>
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onPaste={handlePaste}
                onKeyDown={handleEditorKeyDown}
                className={cn(
                    'w-full p-4 focus:outline-none',
                    'min-h-[200px]',
                    '[&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-gray-400 [&:empty]:before:pointer-events-none'
                )}
                style={{ minHeight, fontSize: baseFontSize, fontFamily: 'Arial, Helvetica, sans-serif' }}
                data-placeholder={placeholder}
                suppressContentEditableWarning
            />
        </div>
    );

    // Sanitize HTML to wrap any orphan text in paragraph tags
    const sanitizeHtml = (html: string): string => {
        if (!html) return '';

        let processedHtml = html;

        // Regex check: if it doesn't start with a tag (ignoring whitespace), wrap the beginning text
        // This is a robust fallback for the "orphan text at top" issue
        if (!/^\s*<[^>]+>/i.test(processedHtml)) {
            const firstTagIndex = processedHtml.indexOf('<');
            if (firstTagIndex === -1) {
                // No tags at all, wrap everything
                if (processedHtml.trim().length > 0) {
                    processedHtml = `<p>${processedHtml}</p>`;
                }
            } else if (firstTagIndex > 0) {
                // Text before first tag
                const text = processedHtml.substring(0, firstTagIndex);
                if (text.trim().length > 0) {
                    processedHtml = `<p>${text}</p>` + processedHtml.substring(firstTagIndex);
                }
            }
        }

        // Create a temporary div to parse the HTML
        const temp = document.createElement('div');
        temp.innerHTML = processedHtml;

        // Wrap any direct text nodes in paragraphs
        Array.from(temp.childNodes).forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent && node.textContent.trim().length > 0) {
                const p = document.createElement('p');
                node.parentNode?.insertBefore(p, node);
                p.appendChild(node);
            }
        });

        return temp.innerHTML;
    };

    // Format HTML for display - show full HTML structure with proper formatting
    const getFormattedHtml = () => {
        if (!value) return '';

        // Get the body content
        let bodyContent = unwrapHtml(value).trim();

        // Sanitize to ensure orphan text is wrapped
        bodyContent = sanitizeHtml(bodyContent);

        // Prettify body content with newlines
        bodyContent = bodyContent
            .replace(/>\s*</g, '>\n<')
            .replace(/(<\/(p|h[1-6]|div|ul|ol|li|table|tr|td|th|blockquote)>)/gi, '$1\n')
            .split('\n')
            .filter(line => line.trim() !== '')
            .map(line => '    ' + line) // Indent body content
            .join('\n')
            .trim();

        // Wrap in full HTML structure with formatting
        const formatted = `<!DOCTYPE html>
<html>
<body>
    ${bodyContent}
</body>
</html>`;

        return formatted;
    };

    const renderHtmlView = () => {
        const formattedHtml = getFormattedHtml();
        const lines = formattedHtml.split('\n');

        // When saving from HTML view, wrap the body content back into full HTML
        const handleChange = (val: string) => {
            onChange(wrapHtml(val));
        };

        return (
            <div className="relative h-full">
                <div className="absolute left-0 top-0 bottom-0 w-10 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-end pr-2 pt-3 text-xs text-gray-400 font-mono select-none overflow-hidden">
                    {lines.map((_, i) => (
                        <div key={i} className="leading-6">{i + 1}</div>
                    ))}
                </div>
                <textarea
                    value={formattedHtml}
                    onChange={(e) => handleChange(e.target.value)}
                    className={cn(
                        'w-full h-full resize-none p-3 pl-12 bg-transparent',
                        'text-sm font-mono leading-6',
                        'focus:outline-none',
                        'placeholder:text-gray-400'
                    )}
                    style={{ minHeight }}
                    spellCheck={false}
                    placeholder="<p>Your content here...</p>"
                />
            </div>
        );
    };

    return (
        <div className={cn(
            "space-y-2",
            isFullscreen && "fixed inset-0 z-50 bg-background p-4 overflow-auto"
        )}>
            {label && !isFullscreen && (
                <label className="text-sm font-medium text-foreground">
                    {label}
                </label>
            )}

            <div className={cn(
                containerClasses,
                isFullscreen && "h-full flex flex-col"
            )}>
                {renderToolbar()}

                <div style={{ minHeight: isFullscreen ? undefined : minHeight }} className={cn(isFullscreen && "flex-1 overflow-auto")}>
                    {/* Keep editor in DOM but hidden to preserve state */}
                    <div style={{ display: viewMode === 'edit' ? 'block' : 'none', height: isFullscreen ? '100%' : undefined }}>
                        {renderEditor()}
                    </div>
                    {viewMode === 'html' && renderHtmlView()}
                </div>
            </div>

            {helperText && !error && (
                <p className="text-xs text-muted-foreground">{helperText}</p>
            )}
            {error && (
                <p className="text-xs text-destructive">{error}</p>
            )}
        </div>
    );
});

export default HtmlEditor;
