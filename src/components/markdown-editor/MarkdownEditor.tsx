import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Dropdown, ButtonGroup } from 'react-bootstrap';
import './MarkdownEditor.scss';
import { BackButton } from '../../shared/back-button/BackButton';

interface MarkdownEditorProps {}

const MarkdownEditor: React.FC<MarkdownEditorProps> = () => {
  const [markdown, setMarkdown] = useState<string>('# Welcome to Markdown Editor\n\nStart typing your markdown here...\n\n## Features\n- **Bold text**\n- *Italic text*\n- [Links](https://example.com)\n- `Code snippets`\n\n### Code Block\n```javascript\nconst hello = "world";\nconsole.log(hello);\n```\n\n> This is a blockquote\n\n- List item 1\n- List item 2\n- List item 3\n\n1. Numbered list\n2. Second item\n3. Third item');
  const [preview, setPreview] = useState<string>('');

  // Simple markdown to HTML converter
  const convertMarkdownToHtml = (md: string): string => {
    let html = md;
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Bold
    html = html.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');
    
    // Italic
    html = html.replace(/\*(.*)\*/gim, '<em>$1</em>');
    
    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/gim, '<pre><code class="language-$1">$2</code></pre>');
    
    // Inline code
    html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Blockquotes
    html = html.replace(/^> (.*)$/gim, '<blockquote>$1</blockquote>');
    
    // Unordered lists
    html = html.replace(/^- (.*)$/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');
    
    // Ordered lists
    html = html.replace(/^\d+\. (.*)$/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/gim, (match) => {
      if (!match.includes('<ul>')) {
        return '<ol>' + match + '</ol>';
      }
      return match;
    });
    
    // Line breaks
    html = html.replace(/\n/gim, '<br>');
    
    // Clean up multiple br tags
    html = html.replace(/(<br>){2,}/gim, '<br><br>');
    
    return html;
  };

  useEffect(() => {
    const htmlPreview = convertMarkdownToHtml(markdown);
    setPreview(htmlPreview);
  }, [markdown]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Markdown Document</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1, h2, h3 { color: #333; }
        code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
        pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
        blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 20px; color: #666; }
    </style>
</head>
<body>
    ${preview}
</body>
</html>`;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearEditor = () => {
    setMarkdown('');
  };

  const insertTemplate = (template: string) => {
    setMarkdown(template);
  };

  const templates = {
    readme: `# Project Title

A brief description of what this project does and who it's for.

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

\`\`\`javascript
const example = require('example');
example.doSomething();
\`\`\`

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

## License

[MIT](https://choosealicense.com/licenses/mit/)`,
    
    blog: `# Blog Post Title

*Published on ${new Date().toLocaleDateString()}*

## Introduction

Write your introduction here...

## Main Content

### Section 1

Your content here...

### Section 2

More content...

## Conclusion

Wrap up your thoughts...

---

*Tags: #markdown #blog #writing*`,
    
    documentation: `# API Documentation

## Overview

Brief description of the API.

## Authentication

\`\`\`
Authorization: Bearer <token>
\`\`\`

## Endpoints

### GET /api/users

Returns a list of users.

**Parameters:**
- \`limit\` (optional): Number of users to return
- \`offset\` (optional): Number of users to skip

**Response:**
\`\`\`json
{
  "users": [],
  "total": 0
}
\`\`\`

### POST /api/users

Creates a new user.

**Request Body:**
\`\`\`json
{
  "name": "string",
  "email": "string"
}
\`\`\``
  };

  return (
    <div className="min-vh-100 bg-light">
      <BackButton />
      <Container fluid className="py-4">
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-bottom">
                <Row className="align-items-center">
                  <Col md={6}>
                    <h1 className="h3 mb-0 text-primary">
                      📝 Markdown Editor
                    </h1>
                  </Col>
                  <Col md={6} className="text-end">
                    <ButtonGroup size="sm" className="me-2">
                      <Dropdown>
                        <Dropdown.Toggle variant="outline-secondary" size="sm">
                          📋 Templates
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => insertTemplate(templates.readme)}>
                            📄 README
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => insertTemplate(templates.blog)}>
                            📝 Blog Post
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => insertTemplate(templates.documentation)}>
                            📚 Documentation
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </ButtonGroup>
                    <ButtonGroup size="sm">
                      <Button variant="outline-danger" onClick={clearEditor}>
                        🗑️ Clear
                      </Button>
                      <Button variant="outline-primary" onClick={downloadMarkdown}>
                        ⬇️ MD
                      </Button>
                      <Button variant="primary" onClick={downloadHtml}>
                        ⬇️ HTML
                      </Button>
                    </ButtonGroup>
                  </Col>
                </Row>
              </Card.Header>
            </Card>
          </Col>
        </Row>
        
        <Row className="g-3" style={{ height: 'calc(100vh - 200px)' }}>
          <Col lg={6}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">✏️ Markdown Input</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Form.Control
                  as="textarea"
                  value={markdown}
                  onChange={handleInputChange}
                  placeholder="Type your markdown here..."
                  className="border-0 h-100 rounded-0"
                  style={{
                    fontFamily: 'Monaco, Menlo, Ubuntu Mono, monospace',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    resize: 'none',
                    minHeight: '500px'
                  }}
                />
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={6}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Header className="bg-success text-white">
                <h5 className="mb-0">👁️ Live Preview</h5>
              </Card.Header>
              <Card.Body 
                className="overflow-auto"
                style={{ 
                  minHeight: '500px',
                  maxHeight: 'calc(100vh - 300px)'
                }}
              >
                <div 
                  className="markdown-preview"
                  dangerouslySetInnerHTML={{ __html: preview }}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MarkdownEditor;
