'use strict';

/**
 * @ngdoc service
 * @name thisDayApp.wikiQuery
 * @description
 * # wikiQuery
 * Factory in the thisDayApp.
 */
angular.module('thisDayApp')
  .factory('wikiQuery', function ($http, $q) {
    // Service logic
    var endpoint = 'https://en.wikipedia.org/w/api.php?';

    var getRandomInt = function getRandomInt (maxNumber) {
      return Math.floor((Math.random() * maxNumber) + 1);
    };

    var getChildrenFromList = function getChildrenFromList (listEl) {
      var listItems = angular.element(listEl).find('li');
      var data = [];

      listItems.map(function (item) {

        var nameEl = angular.element(listItems[item]);
        var info = {};

        info.name = getTextOfNodeType(nameEl, 1);
        info.description = getTextOfNodeType(nameEl, 3);
        info.link = nameEl.attr('href');

        data.push(info);
      });

      return data;
    };

    var getListForDay = function getListForDay (date, type) {

      var deferred = $q.defer();

      var data = [];

      var queryParams = {
        action: 'parse',
        page: date,
        prop: 'text',
        section: type,
        format: 'json',
        callback: 'JSON_CALLBACK',
      };

      $http({
        method: 'jsonp',
        url: endpoint,
        params: queryParams
      }).then(function (res) {

        var text;

        if (! res.data.parse) {
          console.error("Invalid query!");
          return;
        } else {
          text = res.data.parse.text['*'];
        }

        var listItems = angular.element(text).find('li');
        var data = [];

        angular.forEach(listItems, function (itemEl, index) {
          
          var year, itemName, itemLink;

          var element = angular.element(itemEl);
          var elementLinkTextArray = [];

          // Split 1
          var elementTextArray = element.text().split(' – ');

          // If there is a sublist, this is an event line
          if (element.children('ul').length > 0) {

            getChildrenFromList(element.children('ul').first()).forEach(function (item) {
              data.push({
                year: elementTextArray[0],
                name: item.name,
                link: item.link
              });
            });

            return;
          }

          if (elementTextArray[1]) {

            var textAfterYear = elementTextArray[1].split(', ');

            // Get the text from link names
            angular.forEach(element.children('a'), function (childEl, index) {
              var element = angular.element(childEl);
              elementLinkTextArray.push(element.text());
            });

            // There is no link for the year
            if (elementLinkTextArray[0] !== elementTextArray[0]) {
              year = elementTextArray[0];
              itemName = element.children('a').first().text();
              itemLink = element.children('a').first().attr('href');
            } else {
              year = element.children('a').eq(0).text();
              itemName = element.children('a').eq(1).text();
              itemLink = element.children('a').eq(1).attr('href');
            }

            data.push({
              year: year,
              name: itemName,
              link: itemLink
            });

          }
    
        });
  
        deferred.resolve(data);
      });
  
      return deferred.promise;
    };

    var getImageLink = function getImageLink (imageName) {

      var deferred = $q.defer();
      var url;

      var queryParams = {
        action:   'query',
        titles:   imageName,
        prop:     'imageinfo',
        iiprop:   'url',
        format:   'json',
        callback: 'JSON_CALLBACK'
      };

      $http({
        method: 'jsonp',
        url: endpoint,
        params: queryParams
      }).then(function (res) {
        var data = res.data.query;
        var keys;

        if (data && data.pages) {
          keys = Object.keys(data.pages);
          url = data.pages[keys[0]].imageinfo[0].url;
        }

        deferred.resolve(url);
      });

      return deferred.promise;
    };

    var getImageFromPage = function getImageFromPage (person) {

      var deferred = $q.defer();

      var nameArray = person.name.split(' ');
      var lastName = nameArray[1];

      if (!person.link) {
        person.link = person.name.replace(' ', '_');
      }


      var queryParams = {
        action: 'query',
        titles: person.link,
        prop: 'images',
        // iiprop: 'url',
        // generator: 'images',
        format: 'json',
        callback: 'JSON_CALLBACK',
      };

      $http({
        method: 'jsonp',
        url: endpoint,
        params: queryParams
      }).then(function (res) {

        var imageName, hasGoodImage;
        var data = res.data.query;
        var continueToCheck = true;
        // console.log(data);

        if (data && data.pages) {

          for (var prop in data.pages) {

            // console.log(prop);
            // if (imageName) {
              // break;
            // }

            if (data.pages[prop].images) {
              data.pages[prop].images.forEach(function (image) {

                if (! continueToCheck) {
                  return;
                }

                if (!imageName && image.title.indexOf('svg') === -1) {
                  imageName = image.title;
                }

                nameArray.forEach(function (namePart) {
                  if (image.title.indexOf(namePart) > -1) {
                    imageName = image.title;
                    continueToCheck = false;
                    return;
                  }
                });

              });
            }

          }

        }

        getImageLink(imageName).then(function (data) {
          deferred.resolve(data);
        }, function () {
          deferred.resolve();
        });

      });

      return deferred.promise;      

    };

    var getPersonFromList = function getPersonFromList (list) {

      var deferred = $q.defer();

      var person, random;

      while (! person) {
        random = getRandomInt(list.length);
        person = list[random];
      }

      if (person.link) {
        person.link = person.link.replace('/wiki/' , '');
      } else {
        person.link = person.name.replace(' ', '_');
      }

      console.log(person);

      var queryParams = {
        action: 'query',
        titles: decodeURIComponent(person.link),
        prop: 'extracts',
        exinfo: '',
        exsentences: '3',
        explaintext: '',
        format: 'json',
        callback: 'JSON_CALLBACK',
      };

      $http({
        method: 'jsonp',
        url: endpoint,
        params: queryParams
      }).then(function (res) {
        var data = res.data.query.pages;
        var keys = Object.keys(data);

        var pageData = data[keys[0]];
        var aboutText, personLink;

        if (pageData.extract) {
          if (pageData.extract.indexOf('=') > -1) {
            aboutText = pageData.extract.substring(0, pageData.extract.indexOf('='));
          } else {
            aboutText = pageData.extract;
          }

          var payload = {
            name: person.name,
            year: person.year,
            pageId: pageData.pageid,
            about: aboutText,
            link: person.link
          };


          getImageFromPage(person).then(function (data) {
            if (data) {
              payload.imageUrl = data;
            }

            deferred.resolve(payload);
          })

        } else {
          deferred.reject(); 
        }
        
      });

      return deferred.promise;
    };

    // Public API here
    var service = {};

    service.getList = function getList (day, type) {
      var deferred = $q.defer();
      getListForDay(day, type).then(function (data) {
        deferred.resolve(data);
      })
      return deferred.promise;
    };

    service.personFromList = function personFromList (list) {
      var deferred = $q.defer();
      var person;

      getPersonFromList(list).then(function (result) {
        deferred.resolve(result);
      }, function () {
        // console.log("Failure");
        // return service.personFromList(list);
      });

      return deferred.promise;
    };

    service.getRandomPerson = function getRandomPerson (day, type) {
      var deferred = $q.defer();

      var listPromise, personPromise;
      
      listPromise = getListForDay(day, type);
      personPromise = listPromise.then(function (result) {
        return getPersonFromList(result);
      });

      personPromise.then(function (data) {
        deferred.resolve(data);
      });

      return deferred.promise;     
    };

    return service;
  });
