import React, { useState } from 'react';
import clsx from 'clsx';
import { Emoji } from 'emoji-mart';
import './index.css';
import MicOff from '@material-ui/icons/MicOff';
import Mic from '@material-ui/icons/Mic';
import Videocam from '@material-ui/icons/Videocam';
import VideocamOff from '@material-ui/icons/VideocamOff';

import SettingsModal from '../SettingsModal/SettingsModal';

import Publication from '../../components/Publication/Publication';
import usePublications from '../../hooks/usePublications/usePublications';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useParticipantDisplayIdentity from '../../withHooks/useParticipantDisplayIdentity/useParticipantDisplayIdentity';
import useLocalAudioToggle from '../../hooks/useLocalAudioToggle/useLocalAudioToggle';
import useLocalVideoToggle from '../../hooks/useLocalVideoToggle/useLocalVideoToggle';

import { LocalParticipant, RemoteParticipant, Track } from 'twilio-video';

import { useParticipantMetaContext } from '../ParticipantMetaProvider/useParticipantMetaContext';
import { useParticipantMeta } from '../../withHooks/useParticipantMeta/useParticipantMeta';

import { Avatar } from '../Avatar/Avatar';

interface ParticipantCircleProps {
  participant: LocalParticipant | RemoteParticipant;
  disableAudio?: boolean;
  enableScreenShare?: boolean;
  videoPriority?: Track.Priority;
  styles?: object;
  onClick: () => void;
}

const ParticipantCircle = (props: ParticipantCircleProps) => {
  const { participant, disableAudio, enableScreenShare, videoPriority, styles, onClick } = props;
  const meta = useParticipantMeta(participant);
  const [isHovering, setIsHovering] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const { updateEmoji } = useParticipantMetaContext();
  const { room } = useVideoContext();
  const [isAudioEnabled, toggleAudioEnabled] = useLocalAudioToggle();
  const [isVideoEnabled, toggleVideoEnabled] = useLocalVideoToggle();
  const publications = usePublications(participant);
  const isLocal = participant === room.localParticipant;

  const participantDisplayIdentity = useParticipantDisplayIdentity(participant);
  const emoji = meta.emoji;
  const avatar = meta.avatar;

  let filteredPublications;

  if (enableScreenShare && publications.some(p => p.trackName === 'screen')) {
    filteredPublications = publications.filter(p => p.trackName !== 'camera');
  } else {
    filteredPublications = publications.filter(p => p.trackName !== 'screen');
  }

  // only local participant can see gear icon to open settings
  let settings = null;
  if (isLocal || emoji) {
    settings = (
      <div
        className={clsx('ParticipantCircle-settings', { 'is-set': emoji })}
        onClick={e => {
          e.stopPropagation();
          openSettingsModal();
        }}
      >
        <Emoji emoji={emoji ? emoji : 'gear'} size={24} />
      </div>
    );
  }

  function openSettingsModal() {
    // only the local participant can open their settings
    if (isLocal) {
      setIsSettingsModalOpen(true);
    }
  }

  function closeSettingsModal() {
    setIsSettingsModalOpen(false);
  }

  // `hasVideoPublication` can be used to change the circle's appearance. Below, if there is no video publication
  // an Avatar is rendered.
  let hasVideoPublication = false;
  const pubs = filteredPublications.map(publication => {
    if (publication.kind === 'video') {
      hasVideoPublication = true;
    }
    return (
      <div key={publication.kind} className="ParticipantCircle-participant">
        <Publication
          publication={publication}
          participant={participant}
          isLocal={isLocal}
          disableAudio={disableAudio}
          videoPriority={videoPriority}
          classNames={'ParticipantCircle-videoCircle'}
        />
      </div>
    );
  });

  return (
    <>
      <div
        className={clsx('ParticipantCircle', { 'is-localParticipant': isLocal })}
        style={styles}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => onClick()}
      >
        {hasVideoPublication ? null : <Avatar name={avatar} />}
        {settings}
        {isLocal ? (
          <div className="ParticipantCircle-hud">
            <span
              className={clsx('ParticipantCircle-hud-item', { 'u-opacity1': !isAudioEnabled })}
              onClick={e => {
                e.stopPropagation();
                toggleAudioEnabled();
              }}
            >
              {isAudioEnabled ? <Mic /> : <MicOff />}
            </span>
            <span
              className="ParticipantCircle-hud-item"
              onClick={e => {
                e.stopPropagation();
                toggleVideoEnabled();
              }}
            >
              {isVideoEnabled ? <Videocam /> : <VideocamOff />}
            </span>
          </div>
        ) : null}
        {pubs}
        <div className={clsx('ParticipantCircle-infoOverlay', { 'is-hovering': isHovering || disableAudio })}>
          <div className="ParticipantCircle-overLayText">{participantDisplayIdentity}</div>
        </div>
      </div>
      {isLocal ? (
        <SettingsModal
          isSettingsModalOpen={isSettingsModalOpen}
          closeSettingsModal={closeSettingsModal}
          updateEmoji={updateEmoji}
          emoji={emoji}
          participant={participant}
        />
      ) : null}
    </>
  );
};

export default ParticipantCircle;
