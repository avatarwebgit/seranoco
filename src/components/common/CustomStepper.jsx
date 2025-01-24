import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Check from '@mui/icons-material/Check';
import StepConnector, {
  stepConnectorClasses,
} from '@mui/material/StepConnector';
import { motion } from 'framer-motion'; // Import framer-motion
import { useTranslation } from 'react-i18next';

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: 'rgb(0, 153, 130)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: 'rgb(0, 153, 130)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: '#eaeaf0',
    borderTopWidth: 2,
    borderRadius: 10,
    ...theme.applyStyles('dark', {
      borderColor: theme.palette.grey[800],
    }),
    transition: 'all 0.5s ease',
  },
}));

const QontoStepIconRoot = styled('div')(({ theme }) => ({
  color: '#eaeaf0',
  display: 'flex',
  height: 22,
  alignItems: 'center',
  '& .QontoStepIcon-completedIcon': {
    color: 'rgb(0, 153, 130)',
    zIndex: 1,
    fontSize: 18,
  },
  '& .QontoStepIcon-circle': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
  ...theme.applyStyles('dark', {
    color: theme.palette.grey[700],
  }),
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className='QontoStepIcon-completedIcon' />
      ) : (
        <div className='QontoStepIcon-circle' />
      )}
    </QontoStepIconRoot>
  );
}

QontoStepIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  completed: PropTypes.bool,
};

export default function CustomStepper({ activeStep, className }) {
  const { t } = useTranslation();
  const steps = [t('pc.cart'), t('pc.info'), t('pc.pmethod')]; // Labels for the steps
  return (
    <Stack sx={{ width: '100%' }} spacing={4} className={className}>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<QontoConnector />}
      >
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel StepIconComponent={QontoStepIcon}>
              <p style={{ fontSize: '10px' }}>{label}</p>
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Smooth Animation for Steps */}
      <motion.div
        key={activeStep} // Change animation when step changes
        initial={{ opacity: 0, y: 20 }} // Initial position (invisible and offscreen)
        animate={{ opacity: 1, y: 0 }} // Final position (fully visible)
        exit={{ opacity: 0, y: -20 }} // Exit position (fade out upwards)
        transition={{ duration: 0.5 }} // Duration for the transition
      ></motion.div>
    </Stack>
  );
}
