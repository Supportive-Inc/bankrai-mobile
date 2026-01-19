export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: { email?: string; password?: string; fromRegister?: boolean } | undefined;
  Register: undefined;
  Main: undefined;
  DemoChat: undefined;
};

export type MainStackParamList = {
  Chat: undefined;
  'Financial Overview': undefined;
  Insight: undefined;
  Settings: undefined;
  SettingsMain: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  Subscription: undefined;
};

export type SettingsStackParamList = {
  SettingsMain: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  Subscription: undefined;
};