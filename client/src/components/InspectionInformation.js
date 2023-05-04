import React from 'react';
import './InspectionInformation.css';
import { useTranslation } from 'react-i18next';
import Table from './ui/Table';
import styled from 'styled-components';

const InspectionInformationWrapper = styled.div`
  h2 {
    margin-bottom: 1rem;
  }
`;

const InspectionInformation = ({ inspectionData }) => {
  const data = inspectionData || {};
  const { t } = useTranslation();
  
  return (
    <InspectionInformationWrapper>
      <h2 className="inspection-information-title">{t('inspectionInformationTitle')}</h2>
      <Table className="inspection-information-table">
        <thead>
          <tr>
            <th>{t('subjectOfInspection')}</th>
            <th>{data.subject_of_inspection || ''}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{t('issue')}</td>
            <td>{data.issue || ''}</td>
          </tr>
          <tr>
            <td>{t('riskArea')}</td>
            <td>{data.risk_area || ''}</td>
          </tr>
          <tr>
            <td>{t('officialDuration')}</td>
            <td>{data.official_duration_period || ''}</td>
          </tr>
          <tr>
            <td>{t('totalDuration')}</td>
            <td>{data.total_duration_period || ''}</td>
          </tr>
          <tr>
            <td>{t('participants')}</td>
            <td>{data.participants || ''}</td>
          </tr>
          <tr>
            <td>{t('responsibleInspector')}</td>
            <td>{data.responsible_inspector || ''}</td>
          </tr>
          <tr>
            <td>{t('office')}</td>
            <td>{data.office || ''}</td>
          </tr>
          <tr>
            <td>{t('department')}</td>
            <td>{data.department || ''}</td>
          </tr>
          <tr>
            <td>{t('subjectContactInformation')}</td>
            <td>{data.subject_contact_information || ''}</td>
          </tr>
          <tr>
            <td>{t('inspectionContactPerson')}</td>
            <td>{data.inspection_contact_person || ''}</td>
          </tr>
        </tbody>
      </Table>
      </InspectionInformationWrapper>
  );
};

export default InspectionInformation;