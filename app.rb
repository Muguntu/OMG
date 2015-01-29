require 'sinatra'
require 'net/http'
require 'open-uri'

[:get, :post].each do |method|
  send method, '/' do
    send_file 'public/index.html'
  end
end

# Lynne's alogrithm with harcoded values
get '/omg_search/:barcode' do
  content_type :json
  id = params[:barcode]
  uri = "http://omygoodness-powerme.rhcloud.com/omygoodness/rest/productScan/#{id}"
  open(uri)
end

# The Tesco API is mega shit. Slow and hardly ever even works.
# Eg; GET /tesco_search/5018357009916
get '/tesco_search/:barcode' do
  content_type :json

  # Setup Tesco API
  t = Tesco::Groceries.new(ENV['TESCO_DEVELOPER_KEY'], ENV['TESCO_APP_KEY'])
  t.endpoint = 'https://secure.techfortesco.com/tescolabsapi/restservice.aspx'

  # API request for detailed info about the product associated with the barcode
  barcode_id = params[:barcode]
  results = t.api_request(
  'productsearch',
  searchtext: barcode_id,
  EXTENDEDINFO: 'Y'
  )['Products']
  if results.length == 0
    'notfound'
  else
    results[0]
  end.to_json
end

# This isn't too bad, at least it's faster than the Tesco API
get '/scrape/:barcode' do
  # Barcode lookup
  uri = "http://www.upcindex.com/#{params[:barcode]}"
  # upcindex.com requires a valid browser user agent
  doc = Nokogiri::HTML(open(uri, 'User-Agent' => "Mozilla/5.0 (compatible; MSIE 7.01; Windows NT 5.0)"))
  title = doc.at_css('.span4 .lead strong').text
  encoded = URI.escape title
  # Tesco search
  uri = "http://www.tesco.com/groceries/product/search/default.aspx?searchBox=#{encoded}"
  doc = Nokogiri::HTML(open(uri))
  href = doc.at_css('.product .desc a')['href']
  # Tesco product
  uri = "http://www.tesco.com/#{href}"
  doc = Nokogiri::HTML(open(uri))
  doc.at_css('.detailsWrapper .content table').to_json
end
