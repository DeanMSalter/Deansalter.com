## General use UnattendedDisplay

This application is designed to meet the needs of any establishment that has multiple screens spread across multiple buildings / areas.

For example a school/university or business park.

To start the application:
    `npm install`
    `npm run setup` 
    `npm start`


##Routes
To view messages:
`/messages/?id=x` where x is the id of the screen you wish to display

To submit messages:
`/messages/submission/`

To set up screens and create buildings:
`/messages/settings/`
###Tutorial

#Creating a screen
  To use the application , first a user must navigate to the settings page either from the home page or by going to the page directly.
  Once on the settings page the user must decide if they want to display building information on their screen or not.

  If they do they must create a building using the create building table.
  Once a building has been created , they can then create a screen using that building ID.

  If the user does not want to display building information , simply put 0 as the building ID and untick the building info box.

  The user must ensure they enter a valid city/country into the City field as this will get them weather information.

#Editing a screen
  The same guide applies to editing a screen , simply type in the id of the screen you wish to edit and change the information associated with it. Or click edit next to the screen you wish to edit from the list of screens.

#Submitting messages
  To submit a message the user must navigate to the submission page.
  Once the user is there they must decide if they want to submit a building/location message or a general main screen message.
  They must ensure that the screen/building ID is a valid screen/building. By creating a screen/building on the settings page.
