connection = Bunny.new(host: 'rabbit')
connection.start
ch = connection.create_channel

#ch.fanout("web2")
#queue = ch.queue("users", durable: true)
#queue.bind("web2")

# a service
class RabbitPublisher

  def initialize(channel)
    self.channel = channel
  end

  def publish(exchange_name, message)
    queue_name = "#{exchange_name}-queue"
    queue = channel.queue(queue_name, durable: true)
    exchange = channel.fanout(exchange_name, durable: true)
    queue.bind(exchange_name)
    exchange.publish(message.to_json)
  end

  private
  attr_accessor :channel
end

$rabbit = RabbitPublisher.new(ch)
