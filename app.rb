require 'sinatra'
require 'json'
require 'redis'

configure do
  def load_redis
    url = ENV['REDISTOGO_URL']
    uri = URI.parse(url)
    @redis ||= Redis.new(:host => uri.host, :port => uri.port, :password => uri.password)
  end

  set :redis, load_redis
end

helpers do
  def redis
    settings.redis
  end

  def generate_votes
    votes = settings.redis.keys('VOTE:*')
    if votes.empty?
      return 0
    else
      # Return the total sum of votes
      sum = 0
      votes.each {|v| sum += settings.redis.get(v).to_i}
      return sum
    end
  end
end

get '/' do
  erb :index
end

get '/votes.json' do
  # Display json object containing sum of votes
  {"votes"=> generate_votes}.to_json
end

post '/upvote' do
  timestamp = Time.now.to_i
  redis.incr("VOTE:#{timestamp}")
  redis.expire("VOTE:#{timestamp}", 10)
end

post '/downvote' do
  timestamp = Time.now.to_i
  redis.decr("VOTE:#{timestamp}")
  redis.expire("VOTE:#{timestamp}", 10)
end
