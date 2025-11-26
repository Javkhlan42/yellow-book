'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, Phone, Mail, MapPin, Globe, Clock, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { organizationService } from '../../../services/organizationService';
import { Organization } from '../../../types/organization';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';

// Dynamic import for Map component (client-side only)
const Map = dynamic(() => import('../../ui/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-gray-500">Газрын зураг уншиж байна...</div>
    </div>
  ),
});

export default function OrganizationDetailsPage() {
  const params = useParams();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        setLoading(true);
        const id = parseInt(params.id as string);
        const data = await organizationService.getOrganizationById(id);
        setOrganization(data);
      } catch (error) {
        console.error('Error fetching organization:', error);
        setOrganization(null);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchOrganization();
    }
  }, [params.id]);

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return <Facebook className="w-5 h-5" />;
      case 'twitter': return <Twitter className="w-5 h-5" />;
      case 'linkedin': return <Linkedin className="w-5 h-5" />;
      case 'instagram': return <Instagram className="w-5 h-5" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600">Уншиж байна...</div>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Байгууллага олдсонгүй</h2>
          <p className="text-gray-600 mb-4">Таны хайж буй бизнес байхгүй байна.</p>
          <Link href="/directory">
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900">
              Лавлах руу буцах
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            href="/directory" 
            className="inline-flex items-center text-yellow-600 hover:text-yellow-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Лавлах руу буцах
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
                      Онцлох
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
                  Залгах
                </a>
              </Button>
              <Button variant="outline" asChild className="border-yellow-400 text-yellow-600 hover:bg-yellow-50">
                <a href={`mailto:${organization.email}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  Имэйл
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
                <CardTitle>Танилцуулга</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{organization.fullDescription}</p>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle>Үйлчилгээ</CardTitle>
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

            {/* Map */}
            <Card>
              <CardHeader>
                <CardTitle>Байршил</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Map
                    latitude={organization.coordinates?.lat}
                    longitude={organization.coordinates?.lng}
                    address={organization.address}
                    businessName={organization.name}
                  />
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
                <CardTitle>Холбоо барих</CardTitle>
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
                <CardTitle>Цагийн хуваарь</CardTitle>
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
                  <CardTitle>Биднийг дагаарай</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(organization.socialLinks).map(([platform, url]) => (
                      url && (
                        <a
                          key={platform}
                          href={`https://${url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-yellow-400 hover:text-yellow-900 rounded-full transition-colors"
                        >
                          {getSocialIcon(platform)}
                        </a>
                      )
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Шуурхай үйлдэл</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900">
                  <a href={`tel:${organization.phone}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    Залгах
                  </a>
                </Button>
                <Button variant="outline" asChild className="w-full border-yellow-400 text-yellow-600 hover:bg-yellow-50">
                  <a href={`mailto:${organization.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Имэйл илгээх
                  </a>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <a 
                    href={organization.coordinates 
                      ? `https://www.google.com/maps/search/?api=1&query=${organization.coordinates.lat},${organization.coordinates.lng}&query_place_id=${encodeURIComponent(organization.name)}`
                      : `https://maps.google.com/?q=${encodeURIComponent(organization.address)}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Google Maps-д үзэх
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
