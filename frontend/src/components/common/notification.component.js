import { notification } from "antd"
import "./styles/notification.component.css"

export const NotificationComponent = (type='info', title='', description='', duration=2) => {
    switch (type) {
        case "warning":
            return notification.warning({
                message: title,
                description: description,
                duration: duration,
                placement: "bottomRight"
            });
        case 'error':
            return notification.error({
                message: title,
                description: description,
                duration: duration,
                placement: "bottomRight"
            });
        case 'success':
            return notification.success({
                message: title,
                description: description,
                duration: duration,
                placement: "bottomRight"
            });

        default:
            return notification.info({
                message: title,
                description: description,
                duration: duration,
                placement: "bottomRight"
            });
    }
};


