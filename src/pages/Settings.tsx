import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  Dialog,
  IconButton,
  Fade,
} from '@mui/material';
import {
  AccountCircle,
  Business,
  Payment,
  Notifications,
  Receipt,
  Group,
  Backup,
  Science,
  CreditCard,
  AttachMoney,
  Close as CloseIcon,
} from '@mui/icons-material';
import AccountSettings from '../components/settings/AccountSettings';
import OrganizationSettings from '../components/settings/OrganizationSettings';
import FeeSettings from '../components/settings/FeeSettings';
import PaymentSettings from '../components/settings/PaymentSettings';
import ReminderSettings from '../components/settings/ReminderSettings';
import InvoiceSettings from '../components/settings/InvoiceSettings';
import TeamSettings from '../components/settings/TeamSettings';

const settingsCards = [
  { id: 'account', title: 'Account Settings', icon: AccountCircle, color: '#3b82f6' },
  { id: 'organization', title: 'Organization Settings', icon: Business, color: '#22c55e' },
  { id: 'fee', title: 'Fee Settings', icon: AttachMoney, color: '#f59e0b' },
  { id: 'payment', title: 'Payment Settings', icon: Payment, color: '#8b5cf6' },
  { id: 'notification', title: 'Reminder Settings', icon: Notifications, color: '#ec4899' },
  { id: 'invoice', title: 'Invoice Settings', icon: Receipt, color: '#14b8a6' },
  { id: 'team', title: 'Team Settings', icon: Group, color: '#f43f5e' },
  { id: 'subscription', title: 'Subscription', icon: CreditCard, color: '#06b6d4' },
  { id: 'backup', title: 'Data Backup', icon: Backup, color: '#8b5cf6' },
  { id: 'experimental', title: 'Beta Features', icon: Science, color: '#64748b' },
];

const Settings = () => {
  const [selectedSetting, setSelectedSetting] = useState<string | null>(null);

  const renderSettingContent = (settingId: string) => {
    switch (settingId) {
      case 'account':
        return <AccountSettings />;
      case 'organization':
        return <OrganizationSettings />;
      case 'fee':
        return <FeeSettings />;
      case 'payment':
        return <PaymentSettings />;
      case 'notification':
        return <ReminderSettings />;
      case 'invoice':
        return <InvoiceSettings />;
      case 'team':
        return <TeamSettings />;
      // Add other cases as components are created
      default:
        return null;
    }
  };

  return (
    <Fade in timeout={500}>
      <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: '1600px', margin: '0 auto' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Settings
        </Typography>

        <Grid container spacing={3}>
          {settingsCards.map((card) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={card.id}>
              <Card
                sx={{
                  p: 3,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                  },
                }}
                onClick={() => setSelectedSetting(card.id)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: `${card.color}22`,
                      color: card.color,
                    }}
                  >
                    <card.icon />
                  </Box>
                  <Typography variant="h6">{card.title}</Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog
          open={Boolean(selectedSetting)}
          onClose={() => setSelectedSetting(null)}
          maxWidth="md"
          fullWidth
        >
          <Box sx={{ position: 'relative', p: 3 }}>
            <IconButton
              onClick={() => setSelectedSetting(null)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
            
            {selectedSetting && renderSettingContent(selectedSetting)}
          </Box>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default Settings;