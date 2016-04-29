/**
  @module ember-jsonapi-resources
  @submodule store
**/

import Ember from 'ember';
import { pluralize } from 'ember-inflector';

/**
  Service for a JSON API endpoint a facade to your resource adapter

  @class StoreService
  @requires Ember.Inflector
  @static
*/
export default Ember.Service.extend({

  /**
    Find resource(s) using an id or a using a query `{id: '', query: {}}`

    @method find
    @param {String} type - the entity or resource name will be pluralized unless a `{singleton: true}` option is passed
    @param {Object|String} options (object) or id (string)
    @return {Promise}
  */
  find(type, options) {
    let service = this._service(type, options);
    return service.find(options);
  },

  /**
    Access to the cached object

    @method all
    @param {String} type - the entity or resource name will be pluralized
    @return {Ember.Array}
  */
  all(type) {
    let service = this._service(type);
    return (service.cache && service.cache.data) ? service.cache.data : Ember.A([]);
  },

  /**
    Create a new resource, sends a POST request

    @method createResource
    @param {Resource} the resource instance to serialize
    @return {Promise}
  */
  createResource(type, resource) {
    let service = this._service(type);
    return service.createResource(resource);
  },

  /**
    Patch an existing resource

    @method updateResource
    @param {String} type - the entity or resource name will be pluralized
    @param {Resource} the resource instance to serialize the changed attributes
    @return {Promise}
  */
  updateResource(type, resource) {
    let service = this._service(type);
    return service.updateResource(resource);
  },

  /**
    Delete an existing resource, sends a DELETE request

    @method deleteResource
    @param {String} type - the entity or resource name will be pluralized
    @param {String|Resource} the name (plural) or resource instance w/ self link
    @return {Promise}
  */
  deleteResource(type, resource) {
    let service = this._service(type);
    return service.deleteResource(resource);
  },

  /**
    Creates a relationship, sends a POST request

    Adds using a payload with the resource object:

    - to-one: `{ "data": { "type": "authors", "id": "1" } }`
    - to-many: `{ "data": [{ "type": "comments", "id": "12" }] }`

    @method createRelationship
    @param {String} type the entity or resource name will be pluralized
    @param {Resource} resource instance, has URLs via it's relationships property
    @param {String} relationship name (plural) to find the url from the resource instance
    @param {String} id of the related resource
    @return {Promise}
  */
  createRelationship(type, resource, relationship, id) {
    let service = this._service(type);
    return service.createRelationship(resource, relationship, id);
  },

  /**
    Patch a relationship, either adds or removes everyting, sends a PATCH request

    Adds with payload: `{ "data": { "type": "comments", "id": "12" } }`
    Removes with payload: `{ "data": null }` for to-one or `{ "data": [] }` for to-many

    @method patchRelationship
    @param {String} type the entity or resource name will be pluralized
    @param {Resource} resource instance, has URLs via it's relationships property
    @param {String} relationship name (plural) to find the url from the resource instance
    @return {Promise}
  */
  patchRelationship(type, resource, relationship) {
    let service = this._service(type);
    return service.patchRelationship(resource, relationship);
  },

  /**
    Deletes a relationship, sends a DELETE request

    Removes using a payload with the resource object:

    - to-one: `{ "data": { "type": "authors", "id": "1" } }`
    - to-many: `{ "data": [{ "type": "comments", "id": "12" }] }`

    @method deleteRelationship
    @param {String} type the entity or resource name will be pluralized
    @param {Resource} resource instance, has URLs via it's relationships property
    @param {String} relationship name (plural) to find the url from the resource instance
    @param {String} id of the related resource
    @return {Promise}
  */
  deleteRelationship(type, resource, relationship, id) {
    let service = this._service(type);
    return service.deleteRelationship(resource, relationship, id);
  },

  /**
    Lookup the injected service for a resource, pluralize type arg.

    @private
    @method _service
    @param {String} type - the entity or resource name will be pluralized unless a `{singleton: true}` option is passed
    @param {Object} options (object)
  */
  _service(type, options = {}) {
    if (!options.singleton) {
      type = pluralize(type);
    }
    if (!this[type]) {
      throw new Error(type + ' service not initialized');
    }
    return this[type];
  }
});
