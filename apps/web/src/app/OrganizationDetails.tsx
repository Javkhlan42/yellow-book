import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, Globe, Clock, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { organizations } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

const OrganizationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const organization = organizations.find(org => org.id === parseInt(id || '0'));

  if (!organization) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Organization Not Found</h2>
          <p className="text-gray-600 mb-4">The business you're looking for doesn't exist.</p>
          <Link to="/directory">
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900">
              Back to Directory
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return <Facebook className="w-5 h-5" />;
      case 'twitter': return <Twitter className="w-5 h-5" />;
      case 'linkedin': return <Linkedin className="w-5 h-5" />;
      case 'instagram': return <Instagram className="w-5 h-5" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            to="/directory" 
            className="inline-flex items-center text-yellow-600 hover:text-yellow-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Directory
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex items-start space-x-4">
              <div className="text-5xl">{organization.logo}</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{organization.name}</h1>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="secondary">{organization.category}</Badge>
                  {organization.featured && (
                    <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-500">
                      Featured
                    </Badge>
                  )}
                </div>
                <p className="text-lg text-gray-600">{organization.description}</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900">
                <a href={`tel:${organization.phone}`}>
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </a>
              </Button>
              <Button variant="outline" asChild className="border-yellow-400 text-yellow-600 hover:bg-yellow-50">
                <a href={`mailto:${organization.email}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{organization.fullDescription}</p>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle>Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {organization.services.map((service, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                      <span className="text-gray-700">{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center mb-4">
                  <div className="text-center text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p>Interactive Map</p>
                    <p className="text-sm">Map integration would go here</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{organization.address}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-yellow-600 mr-3" />
                  <a 
                    href={`tel:${organization.phone}`}
                    className="text-yellow-600 hover:text-yellow-700"
                  >
                    {organization.phone}
                  </a>
                </div>
                
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-yellow-600 mr-3" />
                  <a 
                    href={`mailto:${organization.email}`}
                    className="text-yellow-600 hover:text-yellow-700 break-all"
                  >
                    {organization.email}
                  </a>
                </div>
                
                <div className="flex items-center">
                  <Globe className="w-5 h-5 text-yellow-600 mr-3" />
                  <a 
                    href={`https://${organization.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-600 hover:text-yellow-700"
                  >
                    {organization.website}
                  </a>
                </div>
                
                <Separator />
                
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{organization.address}</span>
                </div>
              </CardContent>
            </Card>

            {/* Hours */}
            <Card>
              <CardHeader>
                <CardTitle>Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{organization.hours}</span>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            {organization.socialLinks && Object.keys(organization.socialLinks).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Follow Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(organization.socialLinks).map(([platform, url]) => (
                      <a
                        key={platform}
                        href={`https://${url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-yellow-400 hover:text-yellow-900 rounded-full transition-colors"
                      >
                        {getSocialIcon(platform)}
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900">
                  <a href={`tel:${organization.phone}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </a>
                </Button>
                <Button variant="outline" asChild className="w-full border-yellow-400 text-yellow-600 hover:bg-yellow-50">
                  <a href={`mailto:${organization.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </a>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(organization.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Get Directions
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetails;