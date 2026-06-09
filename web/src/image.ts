const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function imagePath(path: `/images/${string}`) {
  return `${publicBasePath}${path}`;
}

export const images = {
  logo: imagePath("/images/logo.png"),
  location: imagePath("/images/location.png"),

  homeHero: imagePath("/images/home-hero.png"),
  handshakeIcon: imagePath("/images/handshake-icon.png"),

  aboutHero: imagePath("/images/about-hero.jpg"),
  whoWeAre: imagePath("/images/who-we-are.png"),
  aboutOverviewHandshake: imagePath("/images/icon-handshake.png"),
  aboutOverviewBadge: imagePath("/images/icon-badge.png"),
  aboutOverviewLocation: imagePath("/images/icon-location.png"),
  aboutShield: imagePath("/images/about-shield.png"),
  aboutAward: imagePath("/images/about-award.png"),
  aboutCheck: imagePath("/images/about-check.png"),
  aboutSupport: imagePath("/images/about-support.png"),

  networkHero: imagePath("/images/network/network-hero.png"),
  networkHeroJpg: imagePath("/images/network-hero.jpg"),

  servicesHero: imagePath("/images/services/hero-workshop.jpg"),
  serviceDriveable: imagePath("/images/services/drivable-repair.jpg"),
  serviceNonDriveable: imagePath("/images/services/non-drivable-repair.jpg"),
  serviceManagement: imagePath("/images/service-management.png"),

  featureShield: imagePath("/images/shield-icon.png"),
  featureCar: imagePath("/images/car-icon.png"),
  featureAward: imagePath("/images/award-icon.png"),
  featureZap: imagePath("/images/zap-icon.png"),
} as const;
