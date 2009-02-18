var Ninja = Class.create({

  /**
    CONSTANTS
  **/
  
  events: {
    OPTION_UPDATED: "ninja:optionsUpdatedEvent"
  },

  initialize: function(options) {
    
    this.options = Object.extend({
      name : "Ninja",
      abilities: [
        'Kick you in the face',
        'Rip out your spleen'
      ]
    }, options);
  },

  /**
    PUBLIC METHODS
  **/
  
  setName: function(name) {
    this.options.name = name;      

    this.optionsUpdated();
  },
  
  addAbility: function(ability) {
    this.options.abilities.push(ability);
    
    this.optionsUpdated();
  },

  removeAbility: function(index) {
    //return the array of abilities without the one at the specified index
    this.options.abilities = this.options.abilities.without(this.options.abilities[index]);
    
    this.optionsUpdated();
  },

  remove: function() {
    if (this.rendered) {
      //remove the element from the document (does not destroy the element)
      this.html.remove();
      this.rendered = false;      
    }
  },

  /**   
    EVENTS
  **/

  itemClickListener: function(ability) {
    alert(
      "#{name} has performed the following ability on you: \n\n* #{ability}".interpolate(
        { name: this.options.name, ability: ability }) 
    );
  },

  /**
    PRIVATE METHODS 
  **/
  
  updateDisplay: function() {
    //save a reference to the old html
    var oldHTML = this.html;

    //stop observing
    oldHTML.stopObserving(this.events.OPTION_UPDATED, this.updateDisplay.bind(this));

    //create some new html
    this.html = this.createHTML();
    
    oldHTML.replace(this.html);
  },

  createHTML: function() {    
    //create a new div with the class ninja
    var elem = new Element("div", { 'class': 'ninja'}).update(
        new Element("h2").update(this.options.name)
    );

    var list = new Element("ul");

    //go through all the items collecting the return value
    var items = $(this.options.abilities).collect(function(item) {
      //create a new list item
      return new Element("li").update(
        //inside it put an anchor
        new Element("a", { href : 'Javascript:void(0)' }).update(item).observe(
          //when you click on the anchor, fire 'itemClickListener' 
          //on this instance of the class
          'click', this.itemClickListener.bind(this, item)
        ) 
      );    
    //now go through all the returned list items
    }.bind(this)).each(function(htmlItem) {
      //and append them to the unordered list
      list.appendChild(htmlItem);
    });

    //insert the list into the main element
    elem.appendChild(list);

    //start observing for options being updated
    elem.observe(this.events.OPTION_UPDATED, this.updateDisplay.bind(this));      

    return elem;
  },

  optionsUpdated: function() {
    //dispatch a custom event to notify the class instance that it's options have been
    //updated and it needs to re-render
    if (this.rendered) {
      this.html.fire(this.events.OPTION_UPDATED);
    }
  },

  toElement: function() {
    //when an instance of the class is inserted via Element#insert toElement will
    //automatically be fired, this is how we notify the class instance that
    //the class is rendered.  the html has already been generated, all we do
    //is return it
    this.rendered = true;
    
    this.html = this.createHTML();    

    return this.html;
  }
 });