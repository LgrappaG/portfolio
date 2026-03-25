# Portfolio Images Directory

This directory is for storing portfolio images used across the website.

## Expected Images

### Profile Image (`profile.jpg` or `profile.png`)
- Used on the About page
- Recommended size: 500x500px or larger (square aspect ratio)
- Formats: JPG, PNG, WebP
- Location in code: `/images/profile.jpg`

### Project Showcase Image (`showcase.jpg` or `showcase.png`)
- Used on the Projects page as featured showcase
- Recommended size: 1200x675px (16:9 aspect ratio)
- Formats: JPG, PNG, WebP
- Location in code: `/images/showcase.jpg`

## How to Add Images

1. Add your images to this directory
2. Update the corresponding page components:
   - **About page**: Update the image source in the profile image section
   - **Projects page**: Update the image source in the showcase section

## Example Usage

```tsx
import Image from 'next/image';

<Image
  src="/images/profile.jpg"
  alt="Profile"
  width={500}
  height={500}
  priority
/>
```
