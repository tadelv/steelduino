import {
  Alert, AlertColor, Snackbar, SnackbarCloseReason,
} from '@mui/material';
import React, {
  ReactNode, useCallback, useEffect, useState,
} from 'react';
import { Notification, NotificationType } from '../../models/models';

interface SnackMessage {
  content: ReactNode;
  level: AlertColor;
}

export interface SnackNotificationProps {
  notification?: Notification;
}

function typeToAlertColor(type: NotificationType): AlertColor {
  switch (type) {
    case NotificationType.INFO: return 'info';
    case NotificationType.ERROR: return 'error';
    case NotificationType.WARN: return 'warning';
    case NotificationType.SUCCESS: return 'success';
    default: return 'info';
  }
}

function notificationToSnackMessage(notification?: Notification): SnackMessage | undefined {
  return notification
    ? { content: notification.message, level: typeToAlertColor(notification.type) }
    : undefined;
}

function SnackNotification({ notification = undefined }: SnackNotificationProps) {
  const [messageInternal, setMessageInternal] = useState<SnackMessage | undefined>();
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
    setMessageInternal(notificationToSnackMessage(notification));
    setOpen(notification !== undefined);
  }, [notification]);

  const handleClose = useCallback((event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  }, []);

  return (
    <Snackbar
      key={key}
      open={open}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={messageInternal?.level} sx={{ width: '100%' }}>
        {messageInternal?.content}
      </Alert>
    </Snackbar>

  );
}

export default SnackNotification;
