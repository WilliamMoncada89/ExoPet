import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin 
} from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">EP</span>
              </div>
              <span className="text-xl font-bold">ExoPet</span>
            </div>
            <p className="text-gray-300 text-sm">
              Tu tienda especializada en animales exóticos y sus accesorios. 
              Ofrecemos productos de calidad para el cuidado de tus mascotas especiales.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/productos" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Productos
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/sobre-nosotros" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Sobre Nosotros
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Categorías</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/productos?categoria=aves" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Aves
                </Link>
              </li>
              <li>
                <Link to="/productos?categoria=reptiles" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Reptiles
                </Link>
              </li>
              <li>
                <Link to="/productos?categoria=mamiferos" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Mamíferos
                </Link>
              </li>
              <li>
                <Link to="/productos?categoria=peces" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Peces
                </Link>
              </li>
              <li>
                <Link to="/productos?categoria=anfibios" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Anfibios
                </Link>
              </li>
              <li>
                <Link to="/productos?categoria=aracnidos" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Arácnidos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-primary-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  Av. Providencia 1234, Santiago, Chile
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  +56 9 1234 5678
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  contacto@exopet.cl
                </span>
              </div>
            </div>
            
            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Tu email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
                <button className="bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-r-md transition-colors text-sm">
                  Suscribirse
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 ExoPet. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/politica-privacidad" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                Política de Privacidad
              </Link>
              <Link to="/terminos-condiciones" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                Términos y Condiciones
              </Link>
              <Link to="/politica-envios" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                Política de Envíos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer