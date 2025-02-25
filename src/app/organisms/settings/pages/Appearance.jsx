import React, { useState, useEffect, useRef } from 'react';
import { calendarFormat } from '@src/util/libs/momentjs';
import { isMobile } from '@src/util/libs/mobile';
import Button from '@src/app/atoms/button/Button';

import settings from '../../../../client/state/settings';
import Toggle from '../../../atoms/button/Toggle';
import SegmentedControls from '../../../atoms/segmented-controls/SegmentedControls';
import SettingTile from '../../../molecules/setting-tile/SettingTile';

import {
  toggleSystemTheme,
  toggleMarkdown,
  toggleMembershipEvents,
  toggleNickAvatarEvents,
} from '../../../../client/action/settings';
import { tinyAppZoomValidator, tinyConfirm } from '../../../../util/tools';
import matrixAppearance, {
  getAppearance,
  toggleAppearanceAction,
  setAppearance,
} from '../../../../util/libs/appearance';

function AppearanceSection() {
  const [, updateState] = useState({});
  const appearanceSettings = getAppearance();

  const [showStickers, setShowStickers] = useState(appearanceSettings.showStickers);
  const [showUserDMstatus, setShowUserStatus] = useState(appearanceSettings.showUserDMstatus);
  const [pinDMmessages, setPinDMmessages] = useState(appearanceSettings.pinDMmessages);
  const [sendMessageEnter, setSendMessageEnter] = useState(appearanceSettings.sendMessageEnter);
  const [forceThreadButton, setForceThreadButton] = useState(appearanceSettings.forceThreadButton);
  const [sendFileBefore, setSendFileBefore] = useState(appearanceSettings.sendFileBefore);

  const [isEmbedEnabled, setEmbedEnabled] = useState(appearanceSettings.isEmbedEnabled);
  const [isUNhoverEnabled, setUNhoverEnabled] = useState(appearanceSettings.isUNhoverEnabled);

  const [showRoomIdInSpacesManager, setShowRoomIdInSpacesManager] = useState(
    appearanceSettings.showRoomIdInSpacesManager,
  );

  const [isAnimateAvatarsEnabled, setAnimateAvatarsEnabled] = useState(
    appearanceSettings.isAnimateAvatarsEnabled,
  );
  const [enableAnimParams, setEnableAnimParams] = useState(appearanceSettings.enableAnimParams);

  const [isMarkdown, setIsMarkdown] = useState(settings.isMarkdown);

  const [hideMembershipEvents, setHideMembershipEvents] = useState(settings.hideMembershipEvents);
  const [hideNickAvatarEvents, setHideNickAvatarEvents] = useState(settings.hideNickAvatarEvents);

  const [hidePinMessageEvents, setHidePinMessageEvents] = useState(
    appearanceSettings.hidePinMessageEvents,
  );
  const [hideUnpinMessageEvents, setHideUnpinMessageEvents] = useState(
    appearanceSettings.hideUnpinMessageEvents,
  );

  const [isDiscordStyleEnabled, setDiscordStyleEnabled] = useState(
    appearanceSettings.isDiscordStyleEnabled,
  );

  const [is24hours, setIs24hours] = useState(appearanceSettings.is24hours);
  const [calendarFormatOption, setCalendarFormat] = useState(appearanceSettings.calendarFormat);

  const ponyHouseZoomRef = useRef(null);
  const ponyHouseZoomRangeRef = useRef(null);

  useEffect(() => {
    const zoomApp = Number(global.localStorage.getItem('pony-house-zoom'));

    const ponyHouseZoom = $(ponyHouseZoomRef.current);
    const ponyHouseZoomRange = $(ponyHouseZoomRangeRef.current);

    ponyHouseZoom.val(tinyAppZoomValidator(zoomApp));
    ponyHouseZoomRange.val(tinyAppZoomValidator(zoomApp));

    ponyHouseZoomRange.on('change keyup keydown keypress input', () => {
      const newValue = Number(ponyHouseZoomRange.val());
      const value = tinyAppZoomValidator(newValue);
      ponyHouseZoom.val(value);
    });

    ponyHouseZoom.on('change keyup keydown keypress', () => {
      const newValue = Number(ponyHouseZoom.val());
      const value = tinyAppZoomValidator(newValue);
      if (newValue !== value) ponyHouseZoom.val(value);
      ponyHouseZoomRange.val(value);
    });
  }, []);

  const selectEmpty = () => {
    toggleSystemTheme();
    setTimeout(() => {
      updateState({});
    }, 100);
  };

  /*
  <div className="card noselect mb-3">
        <ul className="list-group list-group-flush">
          <li className="list-group-item very-small text-gray">Import/Export settings</li>

          <SettingTile
            title="Manage your settings file"
            content={
              <>
                <div className="very-small text-gray">
                  {
                    "Export or import your client's appearance settings to your account cloud."
                  }
                </div>

                <Button className="mt-2 me-1" variant="primary" type="button" onClick={async () => {
                  const isConfirmed = await tinyConfirm('Are you sure? All your old settings saved in your account will be replaced by the current ones.', 'Export appearance settings');
                  if (isConfirmed) {
                    matrixAppearance.saveCloud();
                    alert(`Your settings have been successfully uploaded to the cloud.`);
                  }
                }}>
                  Export
                </Button>

                <Button className="mt-2 ms-1" variant="primary" type="button" onClick={async () => {
                  const isConfirmed = await tinyConfirm('Are you sure? All your old account settings will be lost.', 'Import appearance settings');
                  if (isConfirmed) {
                    matrixAppearance.loadCloud();
                    alert(`Your settings have been successfully loaded from the cloud.`);
                    updateState({});
                  }
                }}>
                  Import
                </Button>

              </>
            }
          />
        </ul>
      </div>
    */
  return (
    <div>
      <div className="card noselect mb-3">
        <ul className="list-group list-group-flush">
          <li className="list-group-item very-small text-gray">Theme</li>

          <SettingTile
            title="Follow system theme"
            options={
              <Toggle
                className="d-inline-flex"
                isActive={settings.useSystemTheme}
                onToggle={selectEmpty}
              />
            }
            content={
              <div className="very-small text-gray">
                Use light or dark mode based on the system settings.
              </div>
            }
          />

          <SettingTile
            title="Theme"
            content={
              <div className="mt-2">
                <SegmentedControls
                  type="select"
                  selected={settings.useSystemTheme ? -1 : settings.getThemeIndex()}
                  segments={settings.themesName}
                  onEmpty={selectEmpty}
                  onSelect={(index) => {
                    if (settings.useSystemTheme) toggleSystemTheme();
                    settings.setTheme(index);
                    setTimeout(() => {
                      updateState({});
                    }, 100);
                  }}
                />
              </div>
            }
          />

          <li className="list-group-item">
            <label htmlFor="pony_house_zoom" className="form-label small">
              Zoom
            </label>

            <input
              ref={ponyHouseZoomRef}
              type="number"
              max={200}
              min={50}
              className="form-control form-control-bg"
              id="pony_house_zoom"
            />
            <input
              ref={ponyHouseZoomRangeRef}
              max={200}
              min={50}
              type="range"
              className="form-range"
            />

            <div className="very-small text-gray">
              {`Set the application zoom. If the configuration doesn't work, it's because your ${__ENV_APP__.ELECTRON_MODE ? 'client' : 'browser'} is not compatible. (Beta)`}
              <button
                type="button"
                className="ms-3 btn btn-sm btn-secondary"
                onClick={async () => {
                  const ponyHouseZoomRange = $(ponyHouseZoomRangeRef.current);
                  const newValue = Number(ponyHouseZoomRange.val());
                  const value = tinyAppZoomValidator(newValue);

                  global.localStorage.setItem('pony-house-zoom', value);
                  $('body').css('zoom', `${value}%`);
                }}
              >
                Change zoom
              </button>
            </div>
          </li>
        </ul>
      </div>

      <div className="card noselect mt-3">
        <ul className="list-group list-group-flush">
          <li className="list-group-item very-small text-gray">Room users</li>

          <SettingTile
            title="Show user DM status"
            options={
              <Toggle
                className="d-inline-flex"
                isActive={showUserDMstatus}
                onToggle={toggleAppearanceAction('showUserDMstatus', setShowUserStatus)}
              />
            }
            content={
              <div className="very-small text-gray">
                All users in your DM will show whether they are online or not.
              </div>
            }
          />

          <SettingTile
            title="Pin DMs on the sidebar"
            options={
              <Toggle
                className="d-inline-flex"
                isActive={pinDMmessages}
                onToggle={toggleAppearanceAction('pinDMmessages', setPinDMmessages)}
              />
            }
            content={
              <div className="very-small text-gray">
                Whenever you receive a new notification in your DM list, you will see a notification
                icon in the sidebar.
              </div>
            }
          />
        </ul>
      </div>

      <div className="card noselect mt-3">
        <ul className="list-group list-group-flush">
          <li className="list-group-item very-small text-gray">Chat events</li>

          <SettingTile
            title="Hide membership"
            options={
              <Toggle
                className="d-inline-flex"
                isActive={hideMembershipEvents}
                onToggle={() => {
                  toggleMembershipEvents();
                  setHideMembershipEvents(!hideMembershipEvents);
                  updateState({});
                }}
              />
            }
            content={
              <div className="very-small text-gray">
                Hide membership change messages from room timeline. (Join, Leave, Invite, Kick and
                Ban)
              </div>
            }
          />

          <SettingTile
            title="Hide pin message"
            options={
              <Toggle
                className="d-inline-flex"
                isActive={hidePinMessageEvents}
                onToggle={toggleAppearanceAction('hidePinMessageEvents', setHidePinMessageEvents)}
              />
            }
            content={
              <div className="very-small text-gray">
                Hide pin message warning from room timeline.
              </div>
            }
          />

          <SettingTile
            title="Hide unpin message"
            options={
              <Toggle
                className="d-inline-flex"
                isActive={hideUnpinMessageEvents}
                onToggle={toggleAppearanceAction(
                  'hideUnpinMessageEvents',
                  setHideUnpinMessageEvents,
                )}
              />
            }
            content={
              <div className="very-small text-gray">
                Hide unpin message warning from room timeline.
              </div>
            }
          />

          <SettingTile
            title="Hide nick/avatar"
            options={
              <Toggle
                className="d-inline-flex"
                isActive={hideNickAvatarEvents}
                onToggle={() => {
                  toggleNickAvatarEvents();
                  setHideNickAvatarEvents(!hideNickAvatarEvents);
                  updateState({});
                }}
              />
            }
            content={
              <div className="very-small text-gray">
                Hide nick and avatar change messages from room timeline.
              </div>
            }
          />

          <SettingTile
            title="Show sticker features"
            options={
              <Toggle
                className="d-inline-flex"
                isActive={showStickers}
                onToggle={toggleAppearanceAction('showStickers', setShowStickers)}
              />
            }
            content={
              <div className="very-small text-gray">
                This setting will manage both visible stickers on your chatbox and your ability to
                send stickers.
              </div>
            }
          />

          <SettingTile
            title="Send file before"
            options={
              <Toggle
                className="d-inline-flex"
                isActive={sendFileBefore}
                onToggle={toggleAppearanceAction('sendFileBefore', setSendFileBefore)}
              />
            }
            content={
              <div className="very-small text-gray">
                When sending a file that contains a message, the file will be sent first before your
                message.
              </div>
            }
          />
        </ul>
      </div>

      <div className="card noselect mt-3">
        <ul className="list-group list-group-flush">
          <li className="list-group-item very-small text-gray">Room messages</li>

          <SettingTile
            title="Markdown formatting"
            options={
              <Toggle
                className="d-inline-flex"
                isActive={isMarkdown}
                onToggle={() => {
                  toggleMarkdown();
                  setIsMarkdown(!isMarkdown);
                  updateState({});
                }}
              />
            }
            content={
              <div className="very-small text-gray">
                Format messages with markdown syntax before sending.
              </div>
            }
          />

          {isMobile() ? (
            <SettingTile
              title="Send message on enter"
              options={
                <Toggle
                  className="d-inline-flex"
                  isActive={sendMessageEnter}
                  onToggle={toggleAppearanceAction('sendMessageEnter', setSendMessageEnter)}
                />
              }
              content={
                <div className="very-small text-gray">
                  Send the typed message when the enter key is pressed.
                </div>
              }
            />
          ) : null}

          <SettingTile
            title="Force thread button visibility in encrypted rooms"
            options={
              <Toggle
                className="d-inline-flex"
                isActive={forceThreadButton}
                onToggle={toggleAppearanceAction('forceThreadButton', setForceThreadButton)}
              />
            }
            content={
              <div className="very-small text-gray">
                {
                  "The create thread button will be forced to be visible in encrypted rooms. But if you don't have permission, the button will remain invisible."
                }
              </div>
            }
          />
        </ul>
      </div>

      <div className="card noselect mt-3">
        <ul className="list-group list-group-flush">
          <li className="list-group-item very-small text-gray">Time format</li>

          <SettingTile
            title="24 hours clock"
            options={
              <Toggle
                className="d-inline-flex"
                isActive={is24hours}
                onToggle={toggleAppearanceAction('is24hours', setIs24hours)}
              />
            }
            content={
              <div className="very-small text-gray">Do not use the standard 12-hour clock.</div>
            }
          />

          <SettingTile
            title="Calendar format"
            content={
              <div className="mt-2">
                <SegmentedControls
                  type="select"
                  selected={
                    typeof calendarFormatOption === 'number' && calendarFormatOption > -1
                      ? calendarFormatOption
                      : 0
                  }
                  segments={calendarFormat}
                  onSelect={(index) => {
                    const value = Number(index);
                    setAppearance('calendarFormat', value);
                    setCalendarFormat(value);
                  }}
                />
              </div>
            }
          />
        </ul>
      </div>

      <div className="card noselect mt-3">
        <ul className="list-group list-group-flush">
          <li className="list-group-item very-small text-gray">User message</li>

          <SettingTile
            title="Enable username hover"
            options={
              <Toggle
                className="d-inline-flex"
                isActive={isUNhoverEnabled}
                onToggle={toggleAppearanceAction('isUNhoverEnabled', setUNhoverEnabled)}
              />
            }
            content={
              <div className="very-small text-gray">
                When you hover over a user nickname, the username will be displayed.
              </div>
            }
          />

          <SettingTile
            title="The discord font style"
            options={
              <Toggle
                className="d-inline-flex"
                isActive={isDiscordStyleEnabled}
                onToggle={toggleAppearanceAction('isDiscordStyleEnabled', (value) => {
                  const body = $('body');

                  body.removeClass('discord-style');
                  if (value) body.addClass('discord-style');
                  setDiscordStyleEnabled(value);
                })}
              />
            }
            content={
              <div className="very-small text-gray">
                Are you looking for the discord style in your life? So check this option for this to
                come true in the font style.
              </div>
            }
          />
        </ul>
      </div>

      <div className="card noselect mt-3">
        <ul className="list-group list-group-flush">
          <li className="list-group-item very-small text-gray">User avatars</li>

          <SettingTile
            title="Use native gif thumbs"
            options={
              <Toggle
                className="d-inline-flex"
                isActive={enableAnimParams}
                onToggle={toggleAppearanceAction('enableAnimParams', setEnableAnimParams)}
              />
            }
            content={
              <div className="very-small text-gray">
                This configuration is disabled by default as not all matrix homeservers are
                compatible with this configuration. If your homeserver is compatible, this will help
                you load images faster and save bandwidth. If your gifs suddenly become static, turn
                this setting off.
              </div>
            }
          />

          <SettingTile
            title="Enable animated hover avatars"
            options={
              <Toggle
                className="d-inline-flex"
                isActive={isAnimateAvatarsEnabled}
                onToggle={toggleAppearanceAction(
                  'isAnimateAvatarsEnabled',
                  setAnimateAvatarsEnabled,
                )}
              />
            }
            content={
              <div className="very-small text-gray">
                Turn on animated avatars that are displayed when you mouse over it.
              </div>
            }
          />
        </ul>
      </div>

      <div className="card noselect mt-3">
        <ul className="list-group list-group-flush">
          <li className="list-group-item very-small text-gray">Spaces</li>

          <SettingTile
            title="Show room id in space manager"
            options={
              <Toggle
                className="d-inline-flex"
                isActive={showRoomIdInSpacesManager}
                onToggle={toggleAppearanceAction(
                  'showRoomIdInSpacesManager',
                  setShowRoomIdInSpacesManager,
                )}
              />
            }
            content={
              <div className="very-small text-gray">{`Show room id next to the room name in the space's room manager.`}</div>
            }
          />
        </ul>
      </div>

      <div className="card noselect mt-3">
        <ul className="list-group list-group-flush">
          <li className="list-group-item very-small text-gray">Embed</li>

          <SettingTile
            title="Enable embed to message url"
            options={
              <Toggle
                className="d-inline-flex"
                isActive={isEmbedEnabled}
                onToggle={toggleAppearanceAction('isEmbedEnabled', setEmbedEnabled)}
              />
            }
            content={
              <div className="very-small text-gray">All messages with url will load a embed.</div>
            }
          />
        </ul>
      </div>
    </div>
  );
}

export default AppearanceSection;
