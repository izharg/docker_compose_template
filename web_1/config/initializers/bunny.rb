connection = Bunny.new(host: 'rabbit')
connection.start
channel = connection.create_channel

# a service
class RabbitPublisher

  def initialize(channel)
    self.channel = channel
  end

  def publish(exchange_name, message)
    exchange = channel.fanout(exchange_name, durable: true)
    exchange.publish(message.to_json)
  end

  private
  attr_accessor :channel
end

$rabbit = RabbitPublisher.new(channel)
