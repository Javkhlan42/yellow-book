import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Organization } from '../types/organization';

interface OrganizationCardProps {
  organization: Organization;
}

const OrganizationCard: React.FC<OrganizationCardProps> = ({ organization }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-gray-200 hover:border-yellow-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{organization.logo}</div>
            <div>
              <Link 
                href={`/organization/${organization.id}`}
                className="text-lg font-semibold text-gray-900 hover:text-yellow-600 transition-colors"
              >
                {organization.name}
              </Link>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {organization.category}
                </Badge>
                {organization.featured && (
                  <Badge className="text-xs bg-yellow-400 text-yellow-900 hover:bg-yellow-500">
                    Онцлох
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {organization.description}
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2 text-yellow-600" />
            <a 
              href={`tel:${organization.phone}`}
              className="hover:text-yellow-600 transition-colors"
            >
              {organization.phone}
            </a>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="w-4 h-4 mr-2 text-yellow-600" />
            <a 
              href={`mailto:${organization.email}`}
              className="hover:text-yellow-600 transition-colors truncate"
            >
              {organization.email}
            </a>
          </div>
          
          <div className="flex items-start text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-yellow-600 mt-0.5 flex-shrink-0" />
            <a
              href={organization.coordinates 
                ? `https://www.google.com/maps/search/?api=1&query=${organization.coordinates.lat},${organization.coordinates.lng}&query_place_id=${encodeURIComponent(organization.name)}`
                : `https://maps.google.com/?q=${encodeURIComponent(organization.address)}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="line-clamp-2 hover:text-yellow-600 transition-colors"
            >
              {organization.address}
            </a>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
          <Link 
            href={`/organization/${organization.id}`}
            className="text-yellow-600 hover:text-yellow-700 text-sm font-medium transition-colors"
          >
            Дэлгэрэнгүй үзэх →
          </Link>
          <a
            href={organization.coordinates 
              ? `https://www.google.com/maps/search/?api=1&query=${organization.coordinates.lat},${organization.coordinates.lng}&query_place_id=${encodeURIComponent(organization.name)}`
              : `https://maps.google.com/?q=${encodeURIComponent(organization.address)}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 text-xs font-medium transition-colors"
          >
            🗺️ Зураг
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganizationCard;