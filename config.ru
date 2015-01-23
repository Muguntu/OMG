require 'rubygems'
require 'bundler'
require 'dotenv'
Bundler.require

Dotenv.load

require './app.rb'

use Rack::Cors do
  allow do
    origins '*'
    resource '*', :headers => :any, :methods => :get
  end
end

run Sinatra::Application
