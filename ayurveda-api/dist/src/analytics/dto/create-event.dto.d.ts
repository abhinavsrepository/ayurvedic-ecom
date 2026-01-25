import { CreateLocationDto } from './create-location.dto';
import { CreateDeviceDto } from './create-device.dto';
export declare class CreateEventDto {
    userId?: string;
    sessionId?: string;
    eventType: string;
    eventData?: Record<string, any>;
    location?: CreateLocationDto;
    device?: CreateDeviceDto;
    pageUrl?: string;
    referrer?: string;
}
