import { Action } from '../RoomState/RoomStateProvider';

// `IWidgetProperties` defines the properties that a widget must have.
export interface IWidgetProperties {
  type: string;
  id: string;
  hyperlink: string;
  participantSid: string;
}
// `IWidgetState` is the state maintained by this context provider representing the widgets present in the room.
export interface IWidgetState {
  [key: string]: IWidgetProperties;
}

enum Actions {
  WidgetAdd = 'WIDGET_ADD',
  WidgetRemove = 'WIDGET_REMOVE',
}

export default function reducer(state: IWidgetState = {}, action: Action) {
  const { type, payload } = action;

  switch (type) {
    case Actions.WidgetAdd: {
      const newWidgets = { ...state };
      newWidgets[payload.id] = payload;

      return newWidgets;
    }

    case Actions.WidgetRemove: {
      const newWidgets = { ...state };
      delete newWidgets[payload];

      return newWidgets;
    }
  }

  return state;
}

export const widgetAdd = (widget: IWidgetProperties) => ({
  type: Actions.WidgetAdd,
  payload: widget,
});

export const widgetRemove = (widgetId: string) => ({
  type: Actions.WidgetRemove,
  payload: widgetId,
});
