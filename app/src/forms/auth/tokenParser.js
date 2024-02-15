const PUBLIC_USER = {
  idpUserId: undefined,
  keycloakId: undefined,
  username: 'public',
  firstName: undefined,
  lastName: undefined,
  fullName: 'public',
  email: undefined,
  idp: 'public',
  public: true,
};

const identityProviderParsers = [];

const parseIdir = (token) => {
  if (token.identity_provider === 'idir') {
    const {
      idir_user_guid: idpUserId,
      idir_username: identity,
      identity_provider: idp,
      preferred_username: username,
      given_name: firstName,
      family_name: lastName,
      idir_user_guid: keycloakId,
      name: fullName,
      email,
    } = token;

    return {
      idpUserId: idpUserId,
      keycloakId: keycloakId.replace(/([0-z]{8})([0-z]{4})([0-z]{4})([0-z]{4})([0-z]{12})/, '$1-$2-$3-$4-$5'),
      username: identity ? identity : username,
      firstName: firstName,
      lastName: lastName,
      fullName: fullName,
      email: email,
      idp: 'idir' || idp,
      public: false,
    };
  }
  return PUBLIC_USER;
};

const parseBceidBasic = (token) => {
  if (token.identity_provider === 'bceidbasic') {
    const {
      bceid_user_guid: idpUserId,
      bceid_username: identity,
      identity_provider: idp,
      preferred_username: username,
      bceid_user_guid: keycloakId,
      name: fullName,
      email,
    } = token;

    return {
      idpUserId: idpUserId,
      keycloakId: keycloakId.replace(/([0-z]{8})([0-z]{4})([0-z]{4})([0-z]{4})([0-z]{12})/, '$1-$2-$3-$4-$5'),
      username: identity ? identity : username,
      firstName: '',
      lastName: '',
      fullName: fullName,
      email: email,
      idp: 'bceid-basic' || idp,
      public: false,
    };
  }
  return PUBLIC_USER;
};

const parseBceidBusiness = (token) => {
  if (token.identity_provider === 'bceidbusiness') {
    const {
      bceid_user_guid: idpUserId,
      bceid_username: identity,
      identity_provider: idp,
      preferred_username: username,
      bceid_user_guid: keycloakId,
      name: fullName,
      email,
    } = token;

    return {
      idpUserId: idpUserId,
      keycloakId: keycloakId.replace(/([0-z]{8})([0-z]{4})([0-z]{4})([0-z]{4})([0-z]{12})/, '$1-$2-$3-$4-$5'),
      username: identity ? identity : username,
      firstName: '',
      lastName: '',
      fullName: fullName,
      email: email,
      idp: 'bceid-business' || idp,
      public: false,
    };
  }
  return PUBLIC_USER;
};

// add providers here...
identityProviderParsers.push({
  identity_provider: 'idir',
  parser: parseIdir,
});
identityProviderParsers.push({
  identity_provider: 'bceidbasic',
  parser: parseBceidBasic,
});
identityProviderParsers.push({
  identity_provider: 'bceidbusiness',
  parser: parseBceidBusiness,
});

const tokenParser = {
  getUserInfo: (token) => {
    // if no token then public
    // if token and no (known) identity_provider then public
    // parse based on identity_provider
    if (!token || !token.identity_provider) return PUBLIC_USER;

    const identity_provider = token.identity_provider;
    const parser = identityProviderParsers.find((p) => p.identity_provider === identity_provider);
    if (parser) {
      return parser.parser(token);
    }

    return PUBLIC_USER;
  },
};

module.exports = tokenParser;
