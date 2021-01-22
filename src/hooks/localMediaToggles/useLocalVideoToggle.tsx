import { useLocalTracks } from '../../components/LocalTracksProvider/useLocalTracks';
import { useNamedPublication } from '../useNamedPublication/useNamedPublication';
import { useLocalParticipant } from '../useLocalParticipant/useLocalParticipant';
import { CAMERA_TRACK_NAME } from '../../constants/User';
import { useLocalMediaToggle } from './useLocalMediaToggle';

export default function useLocalVideoToggle(isLocal?: boolean) {
  const { startVideo, stopVideo, videoTrack } = useLocalTracks();
  const videoPub = useNamedPublication(useLocalParticipant(), CAMERA_TRACK_NAME);
  const isPublished = isLocal ? videoTrack : videoPub;

  return useLocalMediaToggle(!!isPublished, startVideo, stopVideo);
}
