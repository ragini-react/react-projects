import React, { useState, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, ProgressBar, Badge } from 'react-bootstrap';
import { BackButton } from '../../shared/back-button/BackButton';
import './PasswordGenerator.scss';

interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState('');
  const [options, setOptions] = useState<PasswordOptions>({
    length: 12,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: false,
  });
  const [strength, setStrength] = useState(0);
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let charset = '';
    if (options.includeUppercase) charset += uppercase;
    if (options.includeLowercase) charset += lowercase;
    if (options.includeNumbers) charset += numbers;
    if (options.includeSymbols) charset += symbols;

    if (charset === '') {
      setPassword('Please select at least one character type');
      setStrength(0);
      return;
    }

    let newPassword = '';
    for (let i = 0; i < options.length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    setPassword(newPassword);
    calculateStrength(newPassword);
  }, [options]);

  const calculateStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    setStrength(score);
  };

  const copyToClipboard = async () => {
    if (password && password !== 'Please select at least one character type') {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStrengthText = () => {
    if (strength <= 2) return 'Weak';
    if (strength <= 4) return 'Medium';
    return 'Strong';
  };

  const getStrengthColor = () => {
    if (strength <= 2) return '#ff6b6b';
    if (strength <= 4) return '#feca57';
    return '#48dbfb';
  };

  return (
    <div className="min-vh-100 gradient-bg d-flex align-items-center">
      <BackButton />
      <Container>
        <Row className="justify-content-center">
          <Col lg={6} md={8}>
            <Card className="border-0 shadow-lg glass-effect">
              <Card.Header className="bg-transparent border-0 text-center py-4">
                <h1 className="display-4 fw-bold text-gradient mb-2">
                  🔐 Password Generator
                </h1>
                <p className="text-muted fs-5 mb-0">Create secure passwords instantly</p>
              </Card.Header>
              
              <Card.Body className="p-4">
                <div className="mb-4">
                  <InputGroup size="lg">
                    <Form.Control
                      type="text"
                      value={password}
                      readOnly
                      placeholder="Generated password will appear here"
                      className="border-0 bg-light text-center fw-bold"
                      style={{ letterSpacing: '1px' }}
                    />
                    <Button
                      variant={copied ? 'success' : 'primary'}
                      onClick={copyToClipboard}
                      disabled={!password || password === 'Please select at least one character type'}
                    >
                      {copied ? '✓ Copied!' : '📋 Copy'}
                    </Button>
                  </InputGroup>
                </div>

                {password && password !== 'Please select at least one character type' && (
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <small className="text-muted">Password Strength</small>
                      <Badge 
                        bg={strength <= 2 ? 'danger' : strength <= 4 ? 'warning' : 'success'}
                        className="text-uppercase"
                      >
                        {getStrengthText()}
                      </Badge>
                    </div>
                    <ProgressBar 
                      now={(strength / 6) * 100} 
                      variant={strength <= 2 ? 'danger' : strength <= 4 ? 'warning' : 'success'}
                      className="mb-3"
                      style={{ height: '8px' }}
                    />
                  </div>
                )}

                <div className="mb-4">
                  <Form.Label className="fw-semibold mb-3">
                    Password Length: <Badge bg="primary">{options.length}</Badge>
                  </Form.Label>
                  <Form.Range
                    min={4}
                    max={50}
                    value={options.length}
                    onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value) })}
                    className="mb-3"
                  />
                </div>

                <div className="mb-4">
                  <Form.Label className="fw-semibold mb-3">Character Types</Form.Label>
                  <div className="d-grid gap-2">
                    <Form.Check
                      type="checkbox"
                      id="uppercase"
                      label="🔤 Uppercase Letters (A-Z)"
                      checked={options.includeUppercase}
                      onChange={(e) => setOptions({ ...options, includeUppercase: e.target.checked })}
                      className="p-2 border rounded bg-light"
                    />
                    <Form.Check
                      type="checkbox"
                      id="lowercase"
                      label="🔡 Lowercase Letters (a-z)"
                      checked={options.includeLowercase}
                      onChange={(e) => setOptions({ ...options, includeLowercase: e.target.checked })}
                      className="p-2 border rounded bg-light"
                    />
                    <Form.Check
                      type="checkbox"
                      id="numbers"
                      label="🔢 Numbers (0-9)"
                      checked={options.includeNumbers}
                      onChange={(e) => setOptions({ ...options, includeNumbers: e.target.checked })}
                      className="p-2 border rounded bg-light"
                    />
                    <Form.Check
                      type="checkbox"
                      id="symbols"
                      label="🔣 Symbols (!@#$%^&*)"
                      checked={options.includeSymbols}
                      onChange={(e) => setOptions({ ...options, includeSymbols: e.target.checked })}
                      className="p-2 border rounded bg-light"
                    />
                  </div>
                </div>

                <div className="d-grid">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    onClick={generatePassword}
                    className="fw-bold py-3"
                  >
                    🎲 Generate Password
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PasswordGenerator;
