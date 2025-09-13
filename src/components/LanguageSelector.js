import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const SelectorContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 2px solid white;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  font-size: 14px;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

function LanguageSelector() {
  const { i18n } = useTranslation();

  const changeLanguage = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <SelectorContainer>
      <Select value={i18n.language} onChange={changeLanguage}>
        <option value="en">English</option>
        <option value="hi">हिंदी</option>
        <option value="pa">ਪੰਜਾਬੀ</option>
      </Select>
    </SelectorContainer>
  );
}

export default LanguageSelector;