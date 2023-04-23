import React, { useState } from 'react';
import AddObservationForm from "./AddObservationForm";
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Navbar = styled.nav`
  top: 0;
  left: 0;
  height: 100%;
  width: 50px;
  background-color: white;
  transition: all 0.3s ease-in-out;
  padding-left: var(--container-padding); // Add this line
  padding-right: var(--container-padding); // Add this line

  &.open {
    width: 300px;
    transition: all 0.3s ease-in-out;
  }
`;

const MenuIcon = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  position: absolute;
  top: 10px;
  left: 15px;
  cursor: pointer;
  background: none;
  border: none;
  outline: none;

  span {
    display: block;
    width: 100%;
    height: 3px;
    margin: 3px 0;
    background-color: var(--dark-grey-text);
    transition: all 0.3s ease-in-out;
  }

  &.open span:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
  }

  &.open span:nth-child(2) {
    opacity: 0;
  }

  &.open span:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
  }
`;

const NavbarNav = styled.div`
  position: relative;
  top: 50px;
  right: 0;
  width: 100%;
  max-height: 0;
  overflow: auto;
  transition: all 0.3s ease-in-out;

  &.open {
    max-height: 100%;
    transition: all 0.3s ease-in-out;
  }
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: 10px;
`;

const NavLink = styled(Link)`
  color: var(--dark-grey-text);
  text-decoration: none;
  display: block;
  padding: 10px;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;
  white-space: normal;
  overflow-wrap: break-word;

  &:hover {
    background-color: var(--accent-grey);
  }
`;

const LanguageSelector = styled.select`
  border: none;
  background-color: transparent;
  color: var(--dark-grey-text);
  cursor: pointer;
  outline: none;

  &:hover,
  &:focus {
    color: var(--primary-blue);
  }
`;

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const handleSubmit = (observation) => {
    console.log("New observation:", observation);
    // Implement the logic for adding a new observation to the backend.
  };

  const changeLanguage = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <Navbar className={`navbar ${isOpen ? 'open' : ''}`}>
      <MenuIcon className={`menu-icon ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </MenuIcon>
      <NavbarNav className={`navbar-nav ${isOpen ? 'open' : ''}`}>
        <NavList>
          <NavItem className="nav-item">
            <Link to="/" className="nav-link">{t("nav.home")}</Link>
          </NavItem>
          <NavItem className="nav-item">
            <a href="#" className="nav-link">{t("nav.current_inspection")}</a>
          </NavItem>
          <NavItem className="nav-item">
            <a href="#" className="nav-link">{t("nav.templates")}</a>
          </NavItem>
          <NavItem className="nav-item">
            <a href="#" className="nav-link">{t("nav.finished_documents")}</a>
          </NavItem>
          <NavItem className="nav-item">
            <a href="#" className="nav-link">{t("nav.regulation")}</a>
          </NavItem>
          <NavItem className="nav-item">
            <a href="#" className="nav-link">{t("nav.other_instructions")}</a>
          </NavItem>
          <NavItem className="nav-item">
            <Link to="/tasks" className="nav-link">
              {t("nav.tasks")}
            </Link>
          </NavItem>
          <NavItem className="nav-item">
            <a href="#" className="nav-link">{t("nav.material_provided")}</a>
          </NavItem>
          <NavItem className="nav-item">
            <a href="#" className="nav-link">{t("nav.interviews")}</a>
          </NavItem>
          <NavItem className="nav-item">
            <a href="#" className="nav-link" onClick={() => setIsFormOpen(true)}>
              {t("nav.enter_observation")}
            </a>
          </NavItem>
          <NavItem className="nav-item">
            <a href="#" className="nav-link">{t("nav.observations_actions")}</a>
          </NavItem>
          <NavItem className="nav-item">
            <a href="#" className="nav-link">{t("nav.final_actions")}</a>
          </NavItem>
          <NavItem className="nav-item">
            <a href="#" className="nav-link">{t("nav.contact")}</a>
          </NavItem>
          <NavItem className="nav-item">
            <a href="#" className="nav-link">{t("nav.qa")}</a>
          </NavItem>
          <NavItem className="nav-item">
            <select
              value={i18n.language}
              onChange={changeLanguage}
              className="language-selector"
            >
              <option value="en">{t("language.english")}</option>
              <option value="fi">{t("language.finnish")}</option>
              {/* Add more languages here */}
            </select>
          </NavItem>
        </NavList>
        <AddObservationForm
          open={isFormOpen}
          handleClose={() => setIsFormOpen(false)}
          handleSubmit={handleSubmit}
        />
      </NavbarNav>
    </Navbar>
  );
};

export default Navigation;
