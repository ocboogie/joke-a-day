import Vue from "vue";

// Since we're using GraphQL, we don't really have a need for a store.
// Although, in some cases a store is necessary. For example, the auth state.
// And since we only use the store for a couple of fields, we can get away
// with something like Vue.observable and not need something heavy duty
// like Vuex
export const store = Vue.observable({
  meId: localStorage.getItem("meId"),
  isAdmin: Boolean(localStorage.getItem("isAdmin")),
  authenticationError: null,
  internalServerErrors: [],
});

export const mutations = {
  // These are past tense because they should not be used to login but instead
  // once you are already logged in. The login request is not done in the
  // mutation.
  loggedIn(meId, admin = false) {
    store.meId = meId;
    localStorage.setItem("meId", meId);
    store.isAdmin = admin;
    if (admin) {
      // The "true" string doesn't have to be "true", it just needs to be
      // truthy since we're just using it as a flag.
      localStorage.setItem("isAdmin", "true");
    }
  },
  loggedOut() {
    store.meId = null;
    localStorage.removeItem("meId");
    store.isAdmin = false;
    localStorage.removeItem("isAdmin");
  },

  setAuthenticationError(error) {
    store.authenticationError = error;
  },
  clearAuthenticationError() {
    store.authenticationError = null;
  },
  setInternalServerErrors(errors) {
    store.internalServerErrors = errors;
  },
  clearInternalServerErrors() {
    store.internalServerErrors = [];
  },
};

export const getters = {
  loggedIn() {
    return Boolean(store.meId);
  },
};
