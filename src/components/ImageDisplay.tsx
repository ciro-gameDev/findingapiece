import './ImageDisplay.css'

interface ImageDisplayProps {
  imageSrc: string | null
  alt?: string
  className?: string
}

/**
 * ImageDisplay - Displays scene images, character portraits, etc.
 * Supports static images and can be extended for videos later
 */
function ImageDisplay({ imageSrc, alt = 'Scene image', className = '' }: ImageDisplayProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement
    // Fallback if image fails to load
    target.style.display = 'none'
    const placeholder = target.nextElementSibling as HTMLElement
    if (placeholder) {
      placeholder.style.display = 'flex'
    }
  }

  return (
    <div className={`image-display ${className}`}>
      {imageSrc ? (
        <img 
          src={imageSrc} 
          alt={alt}
          className="display-image"
          onError={handleImageError}
        />
      ) : null}
      <div className="image-placeholder" style={{ display: imageSrc ? 'none' : 'flex' }}>
        <span>No image</span>
      </div>
    </div>
  )
}

export default ImageDisplay

