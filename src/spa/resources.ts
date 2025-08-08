export class HomeAddressResource {
  latitude: number;
  longitude: number;
  formattedAddress: string;

  constructor(latitude: number, longitude: number, formattedAddress: string) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.formattedAddress = formattedAddress;
  }
}

export class NeighborhoodResource {
  name: string;
  description: string;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }
}

export class CoffeeShopResource {
  name: string;
  address: string;
  phone: string;
  categories: string[];
  rank: number;
  url: string;

  constructor(
    name: string,
    address: string,
    phone: string,
    categories: string[],
    rank: number,
    url: string
  ) {
    this.name = name;
    this.address = address;
    this.phone = phone;
    this.categories = categories;
    this.rank = rank;
    this.url = url;
  }
}
