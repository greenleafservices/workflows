$ = require 'jquery'

do fill = (item = 'Some of the most creative minds in Art') ->
  $('.tagline').append "#{item}"
fill