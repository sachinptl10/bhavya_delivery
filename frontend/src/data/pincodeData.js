// Indian Pincode Data with coordinates for distance calculation
// Format: { pincode, city, state, lat, lng }

const PINCODE_DATA = [
  // Delhi NCR
  { pincode: '110001', city: 'New Delhi', state: 'Delhi', lat: 28.6358, lng: 77.2245 },
  { pincode: '110002', city: 'Darya Ganj', state: 'Delhi', lat: 28.6431, lng: 77.2389 },
  { pincode: '110003', city: 'Civil Lines', state: 'Delhi', lat: 28.6814, lng: 77.2226 },
  { pincode: '110005', city: 'Karol Bagh', state: 'Delhi', lat: 28.6514, lng: 77.1907 },
  { pincode: '110006', city: 'Sadar Bazaar', state: 'Delhi', lat: 28.6562, lng: 77.2080 },
  { pincode: '110008', city: 'Patel Nagar', state: 'Delhi', lat: 28.6500, lng: 77.1700 },
  { pincode: '110010', city: 'Delhi Cantt', state: 'Delhi', lat: 28.5946, lng: 77.1440 },
  { pincode: '110015', city: 'Rajouri Garden', state: 'Delhi', lat: 28.6493, lng: 77.1262 },
  { pincode: '110016', city: 'Hauz Khas', state: 'Delhi', lat: 28.5494, lng: 77.2001 },
  { pincode: '110017', city: 'Malviya Nagar', state: 'Delhi', lat: 28.5283, lng: 77.2093 },
  { pincode: '110019', city: 'Kalkaji', state: 'Delhi', lat: 28.5390, lng: 77.2560 },
  { pincode: '110020', city: 'Saket', state: 'Delhi', lat: 28.5244, lng: 77.2066 },
  { pincode: '110025', city: 'Okhla', state: 'Delhi', lat: 28.5300, lng: 77.2700 },
  { pincode: '110030', city: 'Mehrauli', state: 'Delhi', lat: 28.5158, lng: 77.1754 },
  { pincode: '110044', city: 'Laxmi Nagar', state: 'Delhi', lat: 28.6304, lng: 77.2770 },
  { pincode: '110048', city: 'Chanakyapuri', state: 'Delhi', lat: 28.5903, lng: 77.1768 },
  { pincode: '110049', city: 'East of Kailash', state: 'Delhi', lat: 28.5552, lng: 77.2450 },
  { pincode: '110051', city: 'Krishna Nagar', state: 'Delhi', lat: 28.6594, lng: 77.2789 },
  { pincode: '110060', city: 'Janakpuri', state: 'Delhi', lat: 28.6209, lng: 77.0826 },
  { pincode: '110065', city: 'Hari Nagar', state: 'Delhi', lat: 28.6342, lng: 77.1044 },
  { pincode: '110075', city: 'Dwarka', state: 'Delhi', lat: 28.5921, lng: 77.0460 },
  { pincode: '110085', city: 'Rohini', state: 'Delhi', lat: 28.7320, lng: 77.1207 },
  { pincode: '110091', city: 'Shahdara', state: 'Delhi', lat: 28.6730, lng: 77.2936 },
  { pincode: '110092', city: 'Patparganj', state: 'Delhi', lat: 28.6203, lng: 77.2893 },
  { pincode: '110096', city: 'Dilshad Garden', state: 'Delhi', lat: 28.6839, lng: 77.3153 },

  // Haryana
  { pincode: '122001', city: 'Gurugram', state: 'Haryana', lat: 28.4595, lng: 77.0266 },
  { pincode: '122002', city: 'Gurugram Sector 14', state: 'Haryana', lat: 28.4715, lng: 77.0430 },
  { pincode: '122003', city: 'Gurugram Sector 17', state: 'Haryana', lat: 28.4648, lng: 77.0544 },
  { pincode: '122018', city: 'Gurugram Sector 44', state: 'Haryana', lat: 28.4473, lng: 77.0706 },
  { pincode: '121001', city: 'Faridabad', state: 'Haryana', lat: 28.4089, lng: 77.3178 },
  { pincode: '121002', city: 'Faridabad NIT', state: 'Haryana', lat: 28.3768, lng: 77.3187 },
  { pincode: '132001', city: 'Panipat', state: 'Haryana', lat: 29.3909, lng: 76.9635 },
  { pincode: '134109', city: 'Panchkula', state: 'Haryana', lat: 30.6942, lng: 76.8606 },
  { pincode: '125001', city: 'Hisar', state: 'Haryana', lat: 29.1492, lng: 75.7217 },
  { pincode: '131001', city: 'Sonipat', state: 'Haryana', lat: 28.9931, lng: 77.0151 },
  { pincode: '136118', city: 'Kurukshetra', state: 'Haryana', lat: 29.9695, lng: 76.8783 },
  { pincode: '127021', city: 'Bhiwani', state: 'Haryana', lat: 28.7751, lng: 76.1394 },
  { pincode: '124001', city: 'Rohtak', state: 'Haryana', lat: 28.8955, lng: 76.6066 },
  { pincode: '133001', city: 'Ambala', state: 'Haryana', lat: 30.3782, lng: 76.7767 },
  { pincode: '123401', city: 'Rewari', state: 'Haryana', lat: 28.1900, lng: 76.6194 },

  // Uttar Pradesh
  { pincode: '201301', city: 'Noida', state: 'Uttar Pradesh', lat: 28.5355, lng: 77.3910 },
  { pincode: '201010', city: 'Ghaziabad', state: 'Uttar Pradesh', lat: 28.6692, lng: 77.4538 },
  { pincode: '226001', city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
  { pincode: '208001', city: 'Kanpur', state: 'Uttar Pradesh', lat: 26.4499, lng: 80.3319 },
  { pincode: '211001', city: 'Prayagraj', state: 'Uttar Pradesh', lat: 25.4358, lng: 81.8463 },
  { pincode: '221001', city: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739 },
  { pincode: '250001', city: 'Meerut', state: 'Uttar Pradesh', lat: 28.9845, lng: 77.7064 },
  { pincode: '282001', city: 'Agra', state: 'Uttar Pradesh', lat: 27.1767, lng: 78.0081 },
  { pincode: '243001', city: 'Bareilly', state: 'Uttar Pradesh', lat: 28.3670, lng: 79.4304 },
  { pincode: '201001', city: 'Ghaziabad City', state: 'Uttar Pradesh', lat: 28.6692, lng: 77.4538 },
  { pincode: '273001', city: 'Gorakhpur', state: 'Uttar Pradesh', lat: 26.7606, lng: 83.3732 },
  { pincode: '251001', city: 'Muzaffarnagar', state: 'Uttar Pradesh', lat: 29.4727, lng: 77.7085 },

  // Maharashtra
  { pincode: '400001', city: 'Mumbai GPO', state: 'Maharashtra', lat: 18.9363, lng: 72.8357 },
  { pincode: '400002', city: 'Kalbadevi', state: 'Maharashtra', lat: 18.9548, lng: 72.8318 },
  { pincode: '400003', city: 'Mahalaxmi', state: 'Maharashtra', lat: 18.9823, lng: 72.8390 },
  { pincode: '400004', city: 'Girgaon', state: 'Maharashtra', lat: 18.9562, lng: 72.8168 },
  { pincode: '400005', city: 'Colaba', state: 'Maharashtra', lat: 18.9067, lng: 72.8147 },
  { pincode: '400007', city: 'Grant Road', state: 'Maharashtra', lat: 18.9637, lng: 72.8179 },
  { pincode: '400012', city: 'Parel', state: 'Maharashtra', lat: 19.0045, lng: 72.8422 },
  { pincode: '400020', city: 'Churchgate', state: 'Maharashtra', lat: 18.9322, lng: 72.8264 },
  { pincode: '400050', city: 'Bandra West', state: 'Maharashtra', lat: 19.0596, lng: 72.8295 },
  { pincode: '400051', city: 'Bandra East', state: 'Maharashtra', lat: 19.0596, lng: 72.8507 },
  { pincode: '400053', city: 'Andheri West', state: 'Maharashtra', lat: 19.1197, lng: 72.8296 },
  { pincode: '400058', city: 'Andheri East', state: 'Maharashtra', lat: 19.1136, lng: 72.8697 },
  { pincode: '400059', city: 'Marol', state: 'Maharashtra', lat: 19.1163, lng: 72.8831 },
  { pincode: '400069', city: 'Andheri', state: 'Maharashtra', lat: 19.1197, lng: 72.8464 },
  { pincode: '400070', city: 'Kurla', state: 'Maharashtra', lat: 19.0726, lng: 72.8784 },
  { pincode: '400072', city: 'Ghatkopar', state: 'Maharashtra', lat: 19.0771, lng: 72.9080 },
  { pincode: '400076', city: 'Powai', state: 'Maharashtra', lat: 19.1176, lng: 72.9060 },
  { pincode: '400080', city: 'Mulund', state: 'Maharashtra', lat: 19.1726, lng: 72.9565 },
  { pincode: '400086', city: 'Goregaon', state: 'Maharashtra', lat: 19.1551, lng: 72.8490 },
  { pincode: '400092', city: 'Borivali', state: 'Maharashtra', lat: 19.2307, lng: 72.8567 },
  { pincode: '400097', city: 'Malad', state: 'Maharashtra', lat: 19.1868, lng: 72.8484 },
  { pincode: '400104', city: 'Thane', state: 'Maharashtra', lat: 19.2183, lng: 72.9781 },
  { pincode: '410210', city: 'Navi Mumbai', state: 'Maharashtra', lat: 19.0330, lng: 73.0297 },
  { pincode: '411001', city: 'Pune GPO', state: 'Maharashtra', lat: 18.5196, lng: 73.8554 },
  { pincode: '411004', city: 'Pune Camp', state: 'Maharashtra', lat: 18.5074, lng: 73.8930 },
  { pincode: '411006', city: 'Deccan Gymkhana', state: 'Maharashtra', lat: 18.5167, lng: 73.8405 },
  { pincode: '411014', city: 'Hadapsar', state: 'Maharashtra', lat: 18.5089, lng: 73.9259 },
  { pincode: '411021', city: 'Hinjewadi', state: 'Maharashtra', lat: 18.5911, lng: 73.7390 },
  { pincode: '411027', city: 'Pashan', state: 'Maharashtra', lat: 18.5340, lng: 73.7987 },
  { pincode: '411033', city: 'Kothrud', state: 'Maharashtra', lat: 18.5074, lng: 73.8077 },
  { pincode: '411038', city: 'Kalyani Nagar', state: 'Maharashtra', lat: 18.5463, lng: 73.9019 },
  { pincode: '411045', city: 'Wakad', state: 'Maharashtra', lat: 18.6001, lng: 73.7633 },
  { pincode: '411048', city: 'Kharadi', state: 'Maharashtra', lat: 18.5514, lng: 73.9406 },
  { pincode: '411057', city: 'Aundh', state: 'Maharashtra', lat: 18.5578, lng: 73.8076 },
  { pincode: '440001', city: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882 },
  { pincode: '440010', city: 'Nagpur Dharampeth', state: 'Maharashtra', lat: 21.1467, lng: 79.0724 },
  { pincode: '431001', city: 'Aurangabad', state: 'Maharashtra', lat: 19.8762, lng: 75.3433 },
  { pincode: '422001', city: 'Nashik', state: 'Maharashtra', lat: 20.0063, lng: 73.7900 },
  { pincode: '416001', city: 'Kolhapur', state: 'Maharashtra', lat: 16.7050, lng: 74.2433 },
  { pincode: '401107', city: 'Vasai', state: 'Maharashtra', lat: 19.3919, lng: 72.8397 },

  // Karnataka
  { pincode: '560001', city: 'Bengaluru GPO', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { pincode: '560002', city: 'Frazer Town', state: 'Karnataka', lat: 12.9927, lng: 77.6118 },
  { pincode: '560003', city: 'Ulsoor', state: 'Karnataka', lat: 12.9830, lng: 77.6200 },
  { pincode: '560004', city: 'Basavanagudi', state: 'Karnataka', lat: 12.9424, lng: 77.5745 },
  { pincode: '560008', city: 'Shivaji Nagar', state: 'Karnataka', lat: 12.9857, lng: 77.6050 },
  { pincode: '560010', city: 'Jalahalli', state: 'Karnataka', lat: 13.0439, lng: 77.5485 },
  { pincode: '560011', city: 'Jayanagar', state: 'Karnataka', lat: 12.9308, lng: 77.5838 },
  { pincode: '560017', city: 'Rajajinagar', state: 'Karnataka', lat: 12.9918, lng: 77.5506 },
  { pincode: '560025', city: 'J.P. Nagar', state: 'Karnataka', lat: 12.9078, lng: 77.5929 },
  { pincode: '560029', city: 'Bannerghatta Road', state: 'Karnataka', lat: 12.8871, lng: 77.5974 },
  { pincode: '560034', city: 'Koramangala', state: 'Karnataka', lat: 12.9352, lng: 77.6245 },
  { pincode: '560037', city: 'BTM Layout', state: 'Karnataka', lat: 12.9166, lng: 77.6101 },
  { pincode: '560038', city: 'Indiranagar', state: 'Karnataka', lat: 12.9784, lng: 77.6408 },
  { pincode: '560043', city: 'Whitefield', state: 'Karnataka', lat: 12.9698, lng: 77.7500 },
  { pincode: '560048', city: 'Banashankari', state: 'Karnataka', lat: 12.9255, lng: 77.5468 },
  { pincode: '560050', city: 'HSR Layout', state: 'Karnataka', lat: 12.9116, lng: 77.6389 },
  { pincode: '560066', city: 'Electronic City', state: 'Karnataka', lat: 12.8452, lng: 77.6602 },
  { pincode: '560068', city: 'Sarjapur Road', state: 'Karnataka', lat: 12.9100, lng: 77.6852 },
  { pincode: '560076', city: 'Marathahalli', state: 'Karnataka', lat: 12.9591, lng: 77.7007 },
  { pincode: '560085', city: 'Yelahanka', state: 'Karnataka', lat: 13.1005, lng: 77.5963 },
  { pincode: '560100', city: 'Hebbal', state: 'Karnataka', lat: 13.0358, lng: 77.5970 },
  { pincode: '560103', city: 'Devanahalli', state: 'Karnataka', lat: 13.2462, lng: 77.7116 },
  { pincode: '570001', city: 'Mysuru', state: 'Karnataka', lat: 12.2958, lng: 76.6394 },
  { pincode: '575001', city: 'Mangaluru', state: 'Karnataka', lat: 12.9141, lng: 74.8560 },
  { pincode: '580001', city: 'Dharwad', state: 'Karnataka', lat: 15.4589, lng: 75.0078 },
  { pincode: '590001', city: 'Belgaum', state: 'Karnataka', lat: 15.8497, lng: 74.4977 },
  { pincode: '581301', city: 'Karwar', state: 'Karnataka', lat: 14.8028, lng: 74.1249 },

  // Tamil Nadu
  { pincode: '600001', city: 'Chennai GPO', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { pincode: '600002', city: 'Triplicane', state: 'Tamil Nadu', lat: 13.0571, lng: 80.2748 },
  { pincode: '600004', city: 'Georgetown', state: 'Tamil Nadu', lat: 13.0937, lng: 80.2884 },
  { pincode: '600006', city: 'Mylapore', state: 'Tamil Nadu', lat: 13.0368, lng: 80.2676 },
  { pincode: '600010', city: 'Kilpauk', state: 'Tamil Nadu', lat: 13.0842, lng: 80.2452 },
  { pincode: '600015', city: 'Nandanam', state: 'Tamil Nadu', lat: 13.0317, lng: 80.2416 },
  { pincode: '600017', city: 'T. Nagar', state: 'Tamil Nadu', lat: 13.0418, lng: 80.2341 },
  { pincode: '600020', city: 'Anna Nagar', state: 'Tamil Nadu', lat: 13.0850, lng: 80.2101 },
  { pincode: '600028', city: 'Adyar', state: 'Tamil Nadu', lat: 13.0067, lng: 80.2565 },
  { pincode: '600034', city: 'Saidapet', state: 'Tamil Nadu', lat: 13.0221, lng: 80.2242 },
  { pincode: '600040', city: 'Velachery', state: 'Tamil Nadu', lat: 12.9815, lng: 80.2180 },
  { pincode: '600042', city: 'Nungambakkam', state: 'Tamil Nadu', lat: 13.0569, lng: 80.2425 },
  { pincode: '600045', city: 'Kodambakkam', state: 'Tamil Nadu', lat: 13.0521, lng: 80.2255 },
  { pincode: '600083', city: 'Porur', state: 'Tamil Nadu', lat: 13.0377, lng: 80.1574 },
  { pincode: '600096', city: 'Tambaram', state: 'Tamil Nadu', lat: 12.9249, lng: 80.1000 },
  { pincode: '600097', city: 'OMR Perungudi', state: 'Tamil Nadu', lat: 12.9610, lng: 80.2412 },
  { pincode: '600119', city: 'Sholinganallur', state: 'Tamil Nadu', lat: 12.8996, lng: 80.2275 },
  { pincode: '641001', city: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558 },
  { pincode: '625001', city: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lng: 78.1198 },
  { pincode: '620001', city: 'Tiruchirappalli', state: 'Tamil Nadu', lat: 10.7905, lng: 78.7047 },
  { pincode: '636001', city: 'Salem', state: 'Tamil Nadu', lat: 11.6643, lng: 78.1460 },

  // Telangana
  { pincode: '500001', city: 'Hyderabad GPO', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
  { pincode: '500003', city: 'Kachiguda', state: 'Telangana', lat: 17.3861, lng: 78.4977 },
  { pincode: '500004', city: 'Sultan Bazar', state: 'Telangana', lat: 17.3898, lng: 78.4852 },
  { pincode: '500008', city: 'Banjara Hills', state: 'Telangana', lat: 17.4106, lng: 78.4373 },
  { pincode: '500016', city: 'Ameerpet', state: 'Telangana', lat: 17.4375, lng: 78.4483 },
  { pincode: '500032', city: 'Jubilee Hills', state: 'Telangana', lat: 17.4325, lng: 78.4073 },
  { pincode: '500033', city: 'Madhapur', state: 'Telangana', lat: 17.4504, lng: 78.3917 },
  { pincode: '500034', city: 'Hi-Tech City', state: 'Telangana', lat: 17.4435, lng: 78.3772 },
  { pincode: '500038', city: 'Secunderabad', state: 'Telangana', lat: 17.4399, lng: 78.4983 },
  { pincode: '500072', city: 'Kukatpally', state: 'Telangana', lat: 17.4849, lng: 78.3917 },
  { pincode: '500081', city: 'Gachibowli', state: 'Telangana', lat: 17.4401, lng: 78.3489 },
  { pincode: '500084', city: 'Kondapur', state: 'Telangana', lat: 17.4617, lng: 78.3675 },
  { pincode: '506001', city: 'Warangal', state: 'Telangana', lat: 17.9784, lng: 79.5941 },

  // West Bengal
  { pincode: '700001', city: 'Kolkata GPO', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
  { pincode: '700007', city: 'Bowbazar', state: 'West Bengal', lat: 22.5696, lng: 88.3565 },
  { pincode: '700013', city: 'Park Street', state: 'West Bengal', lat: 22.5511, lng: 88.3553 },
  { pincode: '700019', city: 'Ballygunge', state: 'West Bengal', lat: 22.5301, lng: 88.3645 },
  { pincode: '700020', city: 'Kalighat', state: 'West Bengal', lat: 22.5207, lng: 88.3432 },
  { pincode: '700029', city: 'Alipore', state: 'West Bengal', lat: 22.5337, lng: 88.3350 },
  { pincode: '700032', city: 'Behala', state: 'West Bengal', lat: 22.4948, lng: 88.3163 },
  { pincode: '700046', city: 'Kasba', state: 'West Bengal', lat: 22.5183, lng: 88.3856 },
  { pincode: '700054', city: 'Salt Lake', state: 'West Bengal', lat: 22.5803, lng: 88.4168 },
  { pincode: '700064', city: 'New Town', state: 'West Bengal', lat: 22.5925, lng: 88.4796 },
  { pincode: '700091', city: 'Howrah', state: 'West Bengal', lat: 22.5958, lng: 88.2636 },
  { pincode: '700106', city: 'Rajarhat', state: 'West Bengal', lat: 22.6048, lng: 88.4633 },
  { pincode: '713101', city: 'Durgapur', state: 'West Bengal', lat: 23.5204, lng: 87.3119 },
  { pincode: '721301', city: 'Midnapore', state: 'West Bengal', lat: 22.4260, lng: 87.3195 },
  { pincode: '734001', city: 'Siliguri', state: 'West Bengal', lat: 26.7271, lng: 88.3953 },

  // Gujarat
  { pincode: '380001', city: 'Ahmedabad GPO', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
  { pincode: '380004', city: 'Maninagar', state: 'Gujarat', lat: 23.0005, lng: 72.6010 },
  { pincode: '380006', city: 'Navrangpura', state: 'Gujarat', lat: 23.0366, lng: 72.5598 },
  { pincode: '380007', city: 'Ellis Bridge', state: 'Gujarat', lat: 23.0253, lng: 72.5617 },
  { pincode: '380009', city: 'Paldi', state: 'Gujarat', lat: 23.0102, lng: 72.5597 },
  { pincode: '380015', city: 'Satellite', state: 'Gujarat', lat: 23.0170, lng: 72.5266 },
  { pincode: '380051', city: 'Chandkheda', state: 'Gujarat', lat: 23.1029, lng: 72.5813 },
  { pincode: '380054', city: 'Bopal', state: 'Gujarat', lat: 23.0302, lng: 72.4717 },
  { pincode: '380058', city: 'SG Highway', state: 'Gujarat', lat: 23.0322, lng: 72.5067 },
  { pincode: '380059', city: 'Gota', state: 'Gujarat', lat: 23.1046, lng: 72.5418 },
  { pincode: '382330', city: 'Gandhinagar', state: 'Gujarat', lat: 23.2156, lng: 72.6369 },
  { pincode: '382345', city: 'Gandhinagar Sector 21', state: 'Gujarat', lat: 23.2228, lng: 72.6464 },
  { pincode: '382481', city: 'Sanand', state: 'Gujarat', lat: 22.9903, lng: 72.3756 },
  { pincode: '390001', city: 'Vadodara', state: 'Gujarat', lat: 22.3072, lng: 73.1812 },
  { pincode: '395001', city: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311 },
  { pincode: '395007', city: 'Surat Adajan', state: 'Gujarat', lat: 21.1820, lng: 72.7978 },
  { pincode: '360001', city: 'Rajkot', state: 'Gujarat', lat: 22.3039, lng: 70.8022 },
  { pincode: '370001', city: 'Bhuj', state: 'Gujarat', lat: 23.2420, lng: 69.6669 },
  { pincode: '396001', city: 'Navsari', state: 'Gujarat', lat: 20.9467, lng: 72.9520 },
  { pincode: '388001', city: 'Anand', state: 'Gujarat', lat: 22.5645, lng: 72.9289 },
  { pincode: '362001', city: 'Junagadh', state: 'Gujarat', lat: 21.5222, lng: 70.4579 },
  { pincode: '364001', city: 'Bhavnagar', state: 'Gujarat', lat: 21.7645, lng: 72.1519 },
  { pincode: '382725', city: 'Mehsana', state: 'Gujarat', lat: 23.5880, lng: 72.3693 },
  { pincode: '342001', city: 'Jodhpur', state: 'Rajasthan', lat: 26.2389, lng: 73.0243 },
  { pincode: '342602', city: 'Bilara', state: 'Rajasthan', lat: 26.1800, lng: 73.7100 },
  { pincode: '342003', city: 'Jodhpur East', state: 'Rajasthan', lat: 26.2700, lng: 73.0500 },
  { pincode: '342005', city: 'Jodhpur Paota', state: 'Rajasthan', lat: 26.2850, lng: 73.0200 },
  { pincode: '342006', city: 'Jodhpur Ratanada', state: 'Rajasthan', lat: 26.2750, lng: 73.0100 },
  { pincode: '342008', city: 'Jodhpur Shastri Nagar', state: 'Rajasthan', lat: 26.2600, lng: 73.0400 },
  { pincode: '342011', city: 'Mandore', state: 'Rajasthan', lat: 26.3100, lng: 73.0100 },
  { pincode: '342012', city: 'Pal Road Jodhpur', state: 'Rajasthan', lat: 26.2200, lng: 73.0100 },
  { pincode: '342027', city: 'Luni', state: 'Rajasthan', lat: 26.0500, lng: 72.8600 },

  // Rajasthan
  { pincode: '302001', city: 'Jaipur GPO', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
  { pincode: '302004', city: 'Jaipur C-Scheme', state: 'Rajasthan', lat: 26.9133, lng: 75.8014 },
  { pincode: '302005', city: 'Vaishali Nagar', state: 'Rajasthan', lat: 26.9110, lng: 75.7287 },
  { pincode: '302012', city: 'Malviya Nagar Jaipur', state: 'Rajasthan', lat: 26.8550, lng: 75.8132 },
  { pincode: '302015', city: 'Mansarovar', state: 'Rajasthan', lat: 26.8676, lng: 75.7649 },
  { pincode: '302017', city: 'Tonk Road', state: 'Rajasthan', lat: 26.8681, lng: 75.8005 },
  { pincode: '302019', city: 'Sanganer', state: 'Rajasthan', lat: 26.8282, lng: 75.7899 },
  { pincode: '302020', city: 'Sitapura', state: 'Rajasthan', lat: 26.7905, lng: 75.8486 },
  { pincode: '302021', city: 'Jagatpura', state: 'Rajasthan', lat: 26.8327, lng: 75.8408 },
  { pincode: '302022', city: 'Jhotwara', state: 'Rajasthan', lat: 26.9535, lng: 75.7458 },
  { pincode: '302033', city: 'Amer', state: 'Rajasthan', lat: 26.9855, lng: 75.8513 },
  { pincode: '313001', city: 'Udaipur', state: 'Rajasthan', lat: 24.5854, lng: 73.7125 },
  { pincode: '324001', city: 'Kota', state: 'Rajasthan', lat: 25.2138, lng: 75.8648 },
  { pincode: '305001', city: 'Ajmer', state: 'Rajasthan', lat: 26.4499, lng: 74.6399 },
  { pincode: '311001', city: 'Bhilwara', state: 'Rajasthan', lat: 25.3407, lng: 74.6313 },
  { pincode: '334001', city: 'Bikaner', state: 'Rajasthan', lat: 28.0229, lng: 73.3119 },
  { pincode: '301001', city: 'Alwar', state: 'Rajasthan', lat: 27.5530, lng: 76.6346 },

  // Madhya Pradesh
  { pincode: '462001', city: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126 },
  { pincode: '452001', city: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577 },
  { pincode: '474001', city: 'Gwalior', state: 'Madhya Pradesh', lat: 26.2183, lng: 78.1828 },
  { pincode: '482001', city: 'Jabalpur', state: 'Madhya Pradesh', lat: 23.1815, lng: 79.9864 },

  // Kerala
  { pincode: '682001', city: 'Kochi', state: 'Kerala', lat: 9.9312, lng: 76.2673 },
  { pincode: '695001', city: 'Thiruvananthapuram', state: 'Kerala', lat: 8.5241, lng: 76.9366 },
  { pincode: '673001', city: 'Kozhikode', state: 'Kerala', lat: 11.2588, lng: 75.7804 },
  { pincode: '680001', city: 'Thrissur', state: 'Kerala', lat: 10.5276, lng: 76.2144 },

  // Odisha
  { pincode: '751001', city: 'Bhubaneswar', state: 'Odisha', lat: 20.2961, lng: 85.8245 },
  { pincode: '753001', city: 'Cuttack', state: 'Odisha', lat: 20.4625, lng: 85.8830 },
  { pincode: '769001', city: 'Rourkela', state: 'Odisha', lat: 22.2604, lng: 84.8536 },

  // Punjab
  { pincode: '160001', city: 'Chandigarh', state: 'Chandigarh', lat: 30.7333, lng: 76.7794 },
  { pincode: '141001', city: 'Ludhiana', state: 'Punjab', lat: 30.9010, lng: 75.8573 },
  { pincode: '143001', city: 'Amritsar', state: 'Punjab', lat: 31.6340, lng: 74.8723 },
  { pincode: '144001', city: 'Jalandhar', state: 'Punjab', lat: 31.3260, lng: 75.5762 },
  { pincode: '147001', city: 'Patiala', state: 'Punjab', lat: 30.3340, lng: 76.3869 },
  { pincode: '148001', city: 'Sangrur', state: 'Punjab', lat: 30.2458, lng: 75.8421 },
  { pincode: '151001', city: 'Bathinda', state: 'Punjab', lat: 30.2110, lng: 74.9455 },

  // Bihar
  { pincode: '800001', city: 'Patna GPO', state: 'Bihar', lat: 25.6093, lng: 85.1376 },
  { pincode: '800020', city: 'Kankarbagh', state: 'Bihar', lat: 25.5968, lng: 85.1607 },
  { pincode: '812001', city: 'Bhagalpur', state: 'Bihar', lat: 25.2425, lng: 86.9842 },
  { pincode: '842001', city: 'Muzaffarpur', state: 'Bihar', lat: 26.1209, lng: 85.3647 },

  // Jharkhand
  { pincode: '834001', city: 'Ranchi', state: 'Jharkhand', lat: 23.3441, lng: 85.3096 },
  { pincode: '831001', city: 'Jamshedpur', state: 'Jharkhand', lat: 22.8046, lng: 86.2029 },
  { pincode: '826001', city: 'Dhanbad', state: 'Jharkhand', lat: 23.7957, lng: 86.4304 },
  { pincode: '827001', city: 'Bokaro', state: 'Jharkhand', lat: 23.6693, lng: 86.1511 },

  // Assam
  { pincode: '781001', city: 'Guwahati', state: 'Assam', lat: 26.1445, lng: 91.7362 },
  { pincode: '786001', city: 'Dibrugarh', state: 'Assam', lat: 27.4728, lng: 94.9120 },

  // Chhattisgarh
  { pincode: '492001', city: 'Raipur', state: 'Chhattisgarh', lat: 21.2514, lng: 81.6296 },
  { pincode: '490001', city: 'Durg', state: 'Chhattisgarh', lat: 21.1904, lng: 81.2849 },
  { pincode: '495001', city: 'Bilaspur', state: 'Chhattisgarh', lat: 22.0797, lng: 82.1409 },

  // Goa
  { pincode: '403001', city: 'Panaji', state: 'Goa', lat: 15.4909, lng: 73.8278 },
  { pincode: '403601', city: 'Margao', state: 'Goa', lat: 15.2832, lng: 73.9862 },
  { pincode: '403501', city: 'Mapusa', state: 'Goa', lat: 15.5922, lng: 73.8089 },
  { pincode: '403516', city: 'Calangute', state: 'Goa', lat: 15.5437, lng: 73.7559 },

  // Uttarakhand
  { pincode: '248001', city: 'Dehradun', state: 'Uttarakhand', lat: 30.3165, lng: 78.0322 },
  { pincode: '249401', city: 'Haridwar', state: 'Uttarakhand', lat: 29.9457, lng: 78.1642 },
  { pincode: '263001', city: 'Nainital', state: 'Uttarakhand', lat: 29.3803, lng: 79.4636 },

  // Andhra Pradesh
  { pincode: '520001', city: 'Vijayawada', state: 'Andhra Pradesh', lat: 16.5062, lng: 80.6480 },
  { pincode: '530001', city: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185 },
  { pincode: '517501', city: 'Tirupati', state: 'Andhra Pradesh', lat: 13.6288, lng: 79.4192 },
  { pincode: '522001', city: 'Guntur', state: 'Andhra Pradesh', lat: 16.3067, lng: 80.4365 },

  // Himachal Pradesh
  { pincode: '171001', city: 'Shimla', state: 'Himachal Pradesh', lat: 31.1048, lng: 77.1734 },
  { pincode: '176001', city: 'Kangra', state: 'Himachal Pradesh', lat: 32.0998, lng: 76.2691 },
  { pincode: '175001', city: 'Mandi', state: 'Himachal Pradesh', lat: 31.7088, lng: 76.9320 },

  // Jammu & Kashmir
  { pincode: '180001', city: 'Jammu', state: 'Jammu & Kashmir', lat: 32.7266, lng: 74.8570 },
  { pincode: '190001', city: 'Srinagar', state: 'Jammu & Kashmir', lat: 34.0837, lng: 74.7973 },

  // Tripura
  { pincode: '799001', city: 'Agartala', state: 'Tripura', lat: 23.8315, lng: 91.2868 },

  // Meghalaya
  { pincode: '793001', city: 'Shillong', state: 'Meghalaya', lat: 25.5788, lng: 91.8933 },

  // Manipur
  { pincode: '795001', city: 'Imphal', state: 'Manipur', lat: 24.8170, lng: 93.9368 },

  // Nagaland
  { pincode: '797001', city: 'Kohima', state: 'Nagaland', lat: 25.6751, lng: 94.1086 },

  // Mizoram
  { pincode: '796001', city: 'Aizawl', state: 'Mizoram', lat: 23.7271, lng: 92.7176 },

  // Arunachal Pradesh
  { pincode: '791111', city: 'Itanagar', state: 'Arunachal Pradesh', lat: 27.0844, lng: 93.6053 },

  // Sikkim
  { pincode: '737101', city: 'Gangtok', state: 'Sikkim', lat: 27.3389, lng: 88.6065 },

  // Puducherry
  { pincode: '605001', city: 'Puducherry', state: 'Puducherry', lat: 11.9416, lng: 79.8083 },
];

/**
 * Search pincodes by partial pincode or city name
 * @param {string} query - partial pincode or city name
 * @param {number} limit - max results to return
 * @returns {Array} matching pincodes
 */
export const searchPincodes = (query, limit = 8) => {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase().trim();
  
  const results = PINCODE_DATA.filter(p =>
    p.pincode.startsWith(q) ||
    p.city.toLowerCase().includes(q) ||
    p.state.toLowerCase().includes(q)
  );

  return results.slice(0, limit);
};

/**
 * Find pincode data by exact pincode
 * @param {string} pincode 
 * @returns {Object|null}
 */
export const findPincode = (pincode) => {
  return PINCODE_DATA.find(p => p.pincode === pincode) || null;
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 
 * @param {number} lng1 
 * @param {number} lat2 
 * @param {number} lng2 
 * @returns {number} distance in kilometers
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

/**
 * Get distance between two pincodes
 * @param {string} pincode1 
 * @param {string} pincode2 
 * @returns {number|null} distance in km, or null if pincode not found
 */
export const getDistanceBetweenPincodes = (pincode1, pincode2) => {
  const p1 = findPincode(pincode1);
  const p2 = findPincode(pincode2);
  if (!p1 || !p2) return null;
  return calculateDistance(p1.lat, p1.lng, p2.lat, p2.lng);
};

/**
 * Find the nearest pincode to given coordinates
 * @param {number} lat 
 * @param {number} lng 
 * @returns {Object|null} nearest pincode data with distance
 */
export const findNearestPincode = (lat, lng) => {
  if (!lat || !lng) return null;
  
  let nearest = null;
  let minDist = Infinity;
  
  for (const p of PINCODE_DATA) {
    const dist = calculateDistance(lat, lng, p.lat, p.lng);
    if (dist < minDist) {
      minDist = dist;
      nearest = { ...p, distanceFromUser: dist };
    }
  }
  
  return nearest;
};

export default PINCODE_DATA;

