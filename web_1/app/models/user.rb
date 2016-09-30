class User < ActiveRecord::Base
  after_commit :publish_user, on: :create

  def publish_user
    puts "publishing user"
    resp = $rabbit.publish("users", self.attributes)
    puts resp
  end
end
