import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import initMatrix from '../../../client/initMatrix';
import cons from '../../../client/state/cons';
import { openReadReceipts } from '../../../client/action/navigation';

import Text from '../../atoms/text/Text';
import RawIcon from '../../atoms/system-icons/RawIcon';

import { getUsersActionJsx } from '../../organisms/room/common';

function FollowingMembers({ roomTimeline }) {
  const [followingMembers, setFollowingMembers] = useState([]);
  const { roomId } = roomTimeline;
  const mx = initMatrix.matrixClient;
  const { roomsInput } = initMatrix;
  const myUserId = mx.getUserId();

  const handleOnMessageSent = () => setFollowingMembers([]);

  useEffect(() => {
    const updateFollowingMembers = () => {
      setFollowingMembers(roomTimeline.getLiveReaders());
    };
    updateFollowingMembers();
    roomTimeline.on(cons.events.roomTimeline.LIVE_RECEIPT, updateFollowingMembers);
    roomsInput.on(cons.events.roomsInput.MESSAGE_SENT, handleOnMessageSent);
    return () => {
      roomTimeline.removeListener(cons.events.roomTimeline.LIVE_RECEIPT, updateFollowingMembers);
      roomsInput.removeListener(cons.events.roomsInput.MESSAGE_SENT, handleOnMessageSent);
    };
  }, [roomTimeline]);

  const filteredM = followingMembers.filter((userId) => userId !== myUserId);

  return filteredM.length !== 0 && (
    <button
      className="following-members emoji-size-fix"
      onClick={() => openReadReceipts(roomId, followingMembers)}
      type="button"
    >
      <RawIcon
        size="extra-small"
        fa="fa-solid fa-check-double"
      />
      <Text variant="b2">{getUsersActionJsx(roomId, filteredM, 'following the conversation.')}</Text>
    </button>
  );
}

FollowingMembers.propTypes = {
  roomTimeline: PropTypes.shape({}).isRequired,
};

export default FollowingMembers;
