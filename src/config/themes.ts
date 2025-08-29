import { ThemeConfig } from '../types/theme';

export const themes: Record<string, ThemeConfig> = {
  background_remove: {
    id: 'background_remove',
    name: 'AI背景移除',
    heroMain: {
      title: 'Image Background Remover',
      subtitle: 'One-click professional background removal powered by AI - get pixel-perfect results in seconds.',
      mainImage: '/marketing/images/hero/background_remover/remove_backgrounds.png',
      uploadText: 'Try Now',
      uploadSubText: 'Or drop a file, paste image or URL',
      demoImages: [
        '/marketing/images/hero/background_remover/one.png',
        '/marketing/images/hero/background_remover/two.png',
        '/marketing/images/hero/background_remover/three.png',
        '/marketing/images/hero/background_remover/four.png'
      ]
    },
    fusionGuide: {
      title: 'How to Remove Image<br/>Background in One Step?',
      cards: [
        {
          icon: '/marketing/images/feature/picture.png',
          title: 'Upload Your Image',
          description: 'Upload images from your device (supports JPEG/PNG) or paste URLs, using high-resolution images can achieve the best results.'
        },
        {
          icon: '/marketing/images/feature/water.png',
          title: 'AI Instant Processing',
          description: 'Our AI removes backgrounds flawlessly in seconds with zero manual effort required.'
        },
        {
          icon: '/marketing/images/feature/download.png',
          title: 'Download Ready-to-Use Images',
          description: 'Get transparent PNGs instantly, then save, remove, or enhance with Creamoda\'s full suite of design tools.'
        }
      ]
    },
    whyChoose: {
      title: 'Why Choose Creamoda?',
      cards: [
        {
          title: 'Professional-Quality Precision for Complex Edges',
          description: 'Creamoda provides professional grade accuracy for complex edges such as hair, fur, and glass, without watermarks or reduced resolution, making it ideal for professionals who require pixel perfect transparency.'
        },
        {
          title: 'Smart Detection Model for Flawless Transparency',
          description: 'Advanced detection model preserves fine details like lace or water droplets while auto-smoothing jagged edges, ensuring clean cuts even for translucent objects. If needed, you can reprocess with one click, and we recommend using well-lit, high-contrast images for optimal results.'
        },
        {
          title: 'Rapid Single-Image Processing for Workflow Efficiency',
          description: 'Optimized for speed and simplicity, our one-click removal lets you edit individual images in seconds—perfect for urgent projects without batch processing hassles.'
        }
      ]
    },
    offerMore: {
      title: 'We Offer More',
      cards: [
        {
          image: '/images/card/remove_bg.png',
          title: 'Image Background Remover',
          description: 'Instantly cut out subjects and get a clean, transparent PNG in seconds.'
        },
        {
          image: '/images/card/change_bg.png',
          title: 'Image Background Changer',
          description: 'Replace any background with custom colors, images, or scenes.'
        },
        {
          image: '/images/card/upscale.png',
          title: 'Image Enhancer',
          description: 'Boost image resolution up to 2× without losing sharpness or detail.'
        },
        {
          image: '/marketing/images/card/partial_mod.png',
          title: 'AI Image Changer',
          description: 'Edit or replace only the areas you select, keeping the rest untouched.'
        },
        {
          image: '/images/card/change_color.png',
          title: 'Image Color Changer',
          description: 'Instantly swap product or object colors with realistic results.'
        },
        {
          image: '/marketing/images/card/virtual_try.png',
          title: 'AI Virtual Try-On',
          description: 'Generate lifelike model images wearing your products, cutting shoot costs and boosting sales.'
        },
        {
          image: '/images/card/design.png',
          title: 'AI Outfit Generator',
          description: 'Generate and customize fashion outfits — swap fabrics, tweak styles, redesign patterns, all in one tool.'
        },
        {
          image: '/images/card/sketch_design.png',
          title: 'AI Sketch to Image Converter',
          description: 'Turn garment sketches into realistic images for prototyping and presentations.'
        }
      ]
    },
    faq: {
      items: [
        {
          question: 'Is the background remover free to use?',
          answer: "Every new user gets 5 free credits to explore Creamoda's AI tools. Each feature, like Image Background Remover, uses credits — and you can easily buy more in flexible packages to keep creating without limits."
        },
        {
          question: 'Will the processed images be stored in my account?',
          answer: 'Yes, all processed images will be automatically saved in your portfolio, and you can log in to your account at any time to view, download, or delete these files. We use encrypted storage to ensure the security of your data.'
        },
        {
          question: 'How does the background remover handle complex edges like hair or transparent objects?',
          answer: 'Our AI automatically detects edges with high precision, though results may vary with low-contrast images—high-resolution inputs yield the best outcomes.'
        },
        {
          question: 'Can I customize the background after removal (e.g., change colors)?',
          answer: 'Yes — while background removal exports only transparent PNG or white backgrounds, you can use our Image Background Changer tool to add any color, image, or custom design you want.'
        },
        {
          question: 'How long does the background remover take to process an image?',
          answer: 'Typically, just 2–5 seconds for most images. Even complex images with fine details are usually done in moments — so you can keep creating without waiting.'
        }
      ]
    }
  },

  background_change: {
    id: 'background_change',
    name: 'AI背景替换',
    heroMain: {
      title: 'Image Background Changer',
      subtitle: 'Replace any background in seconds—no skills needed.',
      mainImage: '/marketing/images/hero/background_changer/change_backgrounds.png',
      uploadText: 'Try Now',
      uploadSubText: 'Or drop a file, paste image or URL',
      demoImages: [
        '/marketing/images/hero/background_changer/one.png',
        '/marketing/images/hero/background_changer/two.png',
        '/marketing/images/hero/background_changer/three.png',
        '/marketing/images/hero/background_changer/four.png'
      ]
    },
    fusionGuide: {
      title: 'How to Change Image<br/>Background Using AI?',
      cards: [
        {
          icon: '/marketing/images/feature/picture.png',
          title: 'Upload & Describe ',
          description: 'Upload original image (JPEG/PNG/URL) and describe your desired background (e.g., "sunset by the sea").'
        },
        {
          icon: '/marketing/images/feature/water.png',
          title: 'AI Automatic Processing ',
          description: 'AI intelligently matches tones and details, generating new backgrounds with seamless edge blending.'
        },
        {
          icon: '/marketing/images/feature/download.png',
          title: 'Download & Use',
          description: 'Download your edited image for immediate use or further adjustments.'
        }
      ]
    },
    whyChoose: {
      title: 'Why Choose Creamoda?',
      cards: [
        {
          title: 'Instant Professional Background Replacement',
          description: "Creamoda's AI instantly replaces backgrounds with high precision, perfect for your different project requirements. No manual editing required—just upload and let AI do the work."
        },
        {
          title: 'Seamless Integration with AI-Generated Elements',
          description: 'Our AI seamlessly blends new backgrounds with your images, ensuring natural shadows and lighting for a realistic finish. '
        },
        {
          title: 'Effortless Customization for Diverse Needs',
          description: 'Creamoda offers over a hundred preset design features, allowing for personalized customization by simply choosing according to your needs, making it ideal for users who require fast and versatile editing.'
        }
      ]
    },
    offerMore: {
      title: 'We Offer More',
      cards: [
        {
          image: '/images/card/change_bg.png',
          title: 'Image Background Changer',
          description: 'Replace any background with custom colors, images, or scenes.'
        },
        {
          image: '/images/card/remove_bg.png',
          title: 'Image Background Remover',
          description: 'Instantly cut out subjects and get a clean, transparent PNG in seconds.'
        },
        {
          image: '/images/card/upscale.png',
          title: 'Image Enhancer',
          description: 'Boost image resolution up to 2× without losing sharpness or detail.'
        },
        {
          image: '/images/card/change_color.png',
          title: 'Image Color Changer',
          description: 'Instantly swap product or object colors with realistic results.'
        },
        {
          image: '/marketing/images/card/virtual_try.png',
          title: 'AI Virtual Try-On',
          description: 'Generate lifelike model images wearing your products, cutting shoot costs and boosting sales.'
        },
        {
          image: '/marketing/images/card/partial_mod.png',
          title: 'AI Image Changer',
          description: 'Edit or replace only the areas you select, keeping the rest untouched.'
        },
        {
          image: '/images/card/design.png',
          title: 'AI Outfit Generator',
          description: 'Generate and customize fashion outfits — swap fabrics, tweak styles, redesign patterns, all in one tool.'
        },
        {
          image: '/images/card/sketch_design.png',
          title: 'AI Sketch to Image Converter',
          description: 'Turn garment sketches into realistic images for prototyping and presentations.'
        }
      ]
    },
    faq: {
      items: [
        {
          question: 'Can I use my own images as custom backgrounds?',
          answer: 'Of course! Upload any JPEG/PNG file as a custom background or provide language descriptions to express the image you want to present.'
        },
        {
          question: 'How can I ensure the new background looks natural with my subject?',
          answer: "For natural blending, ensure your subject's lighting direction matches the new background. Our AI automatically adjusts shadows and tones, but you can use our design features tools for manual selection."
        },
        {
          question: 'Is the background changer free to use?',
          answer: 'New users receive 5 free credits to try the feature. Continued use requires purchasing credit packages, which can be done in your account dashboard.'
        },
        {
          question: 'Will the processed images be stored in my account?',
          answer: "Yes, all edited images are saved securely in your portfolio. You can access, download, or delete them anytime via your account."
        },
        {
          question: 'How does AI handle complex foregrounds (e.g., hair, translucent objects)?',
          answer: 'Our AI detects edges with advanced precision, preserving fine details like hair strands or glass reflections. For best results, upload high-resolution images with clear contrast.'
        }
      ]
    }
  },

  image_enhance: {
    id: 'image_enhance',
    name: 'AI图像增强',
    heroMain: {
      title: 'AI Image Enhancer',
      subtitle: 'Transform low-quality images into stunning high-resolution masterpieces with one click – powered by AI.',
      mainImage: '/marketing/images/hero/enhance/enhance.png',
      uploadText: 'Try Now',
      uploadSubText: 'Or drop a file, paste image or URL',
      demoImages: [
        '/marketing/images/hero/enhance/one.png',
        '/marketing/images/hero/enhance/two.png',
        '/marketing/images/hero/enhance/three.png',
        '/marketing/images/hero/enhance/four.png'
      ]
    },
    fusionGuide: {
      title: 'How to Upscale Images Without<br/>Any Quality Loss?',
      cards: [
        {
          icon: '/marketing/images/feature/picture.png',
          title: 'Upload Your Image',
          description: 'Drag & drop any JPEG/PNG file or paste an image URL. For best results, use images with clear outlines.'
        },
        {
          icon: '/marketing/images/feature/water.png',
          title: 'AI Magic Enhancement',
          description: 'Our AI analyzes textures, sharpens edges, and fills missing details—completely automatically.'
        },
        {
          icon: '/marketing/images/feature/download.png',
          title: 'Download HD Results',
          description: 'Save your upscaled image as PNG. Feel free to use your brand new high-definition images!'
        }
      ]
    },
    whyChoose: {
      title: 'Why Choose Creamoda?',
      cards: [
        {
          title: 'Pixel-Perfect AI Reconstruction',
          description: 'Unlike traditional upscaling that creates blur, our AI adds realistic details and cleans noise—perfect for users who need to repair low resolution images.'
        },
        {
          title: 'Suitable for Multiple Scenarios',
          description: 'Our AI can handle fading, scratches, and yellowing while preserving the original features, using realistic detail reconstruction to restore old family photos, historical files, or vintage artworks.'
        },
        {
          title: 'Small Files, Big Impact',
          description: 'Convert smartphone product photos into ultra clear images, or convert quick sketches into presentation ready artworks, supporting export and use at any time.'
        }
      ]
    },
    offerMore: {
      title: 'We Offer More',
      cards: [
        {
          image: '/images/card/upscale.png',
          title: 'Image Enhancer',
          description: 'Boost image resolution up to 2× without losing sharpness or detail.'
        },
        {
          image: '/images/card/remove_bg.png',
          title: 'Image Background Remover',
          description: 'Instantly cut out subjects and get a clean, transparent PNG in seconds.'
        },
        {
          image: '/images/card/change_bg.png',
          title: 'Image Background Changer',
          description: 'Replace any background with custom colors, images, or scenes.'
        },
        {
          image: '/images/card/change_color.png',
          title: 'Image Color Changer',
          description: 'Instantly swap product or object colors with realistic results.'
        },
        {
          image: '/marketing/images/card/partial_mod.png',
          title: 'AI Image Changer',
          description: 'Edit or replace only the areas you select, keeping the rest untouched.'
        },
        {
          image: '/marketing/images/card/virtual_try.png',
          title: 'AI Virtual Try-On',
          description: 'Generate lifelike model images wearing your products, cutting shoot costs and boosting sales.'
        },
        {
          image: '/images/card/design.png',
          title: 'AI Outfit Generator',
          description: 'Generate and customize fashion outfits — swap fabrics, tweak styles, redesign patterns, all in one tool.'
        },
        {
          image: '/images/card/sketch_design.png',
          title: 'AI Sketch to Image Converter',
          description: 'Turn garment sketches into realistic images for prototyping and presentations.'
        }
      ]
    },
    faq: {
      items: [
        {
          question: 'Does AI work better on certain types of images?',
          answer: "Yes, it can repair low resolution images or some old photos. Test with our free credits!"
        },
        {
          question: 'How does AI handle different art styles?',
          answer: 'From watercolors to pixel art, our AI adapts its approach to maintain the authentic style and characteristics of each artwork.'
        },
        {
          question: 'Will upscaling affect my original image quality?',
          answer: "Your original file remains untouched - we always generate a new enhanced version while enhancing the source."
        },
        {
          question: 'Will my upscaled images look artificially enhanced?',
          answer: 'Our AI focuses on natural detail reconstruction—not artificial sharpening. Results maintain authentic textures and avoid that "overprocessed" look.'
        },
        {
          question: 'Does this work for black & white photos?',
          answer: 'Of course! Our AI can work in restoring contrast and tonal range in vintage monochrome photography.'
        }
      ]
    }
  },

  color_change: {
    id: 'color_change',
    name: 'AI颜色替换',
    heroMain: {
      title: 'Image Color Changer',
      subtitle: 'AI-powered color swapping that keeps textures and lighting intact—no more unnatural patches or mismatched shadows.',
      mainImage: '/marketing/images/hero/color_changer/color_changer.png',
      uploadText: 'Try Now',
      uploadSubText: 'Or drop a file, paste image or URL',
      demoImages: [
        '/marketing/images/hero/color_changer/one.webp',
        '/marketing/images/hero/color_changer/two.jpg',
        '/marketing/images/hero/color_changer/three.jpg',
        '/marketing/images/hero/color_changer/four.jpg'
      ]
    },
    fusionGuide: {
      title: 'How to Change Image Color?',
      cards: [
        {
          icon: '/marketing/images/feature/picture.png',
          title: 'Upload & Select Colors',
          description: 'Upload image (JPEG/PNG), sample colors or input HEX codes with sliders for fine-tuning.'
        },
        {
          icon: '/marketing/images/feature/water.png',
          title: 'AI-Powered Color Magic',
          description: 'AI adapts colors naturally based on material textures and lighting.'
        },
        {
          icon: '/marketing/images/feature/download.png',
          title: 'Download & Use ',
          description: 'Get recolored PNGs instantly for further editing or saving.'
        }
      ]
    },
    whyChoose: {
      title: 'Why Choose Creamoda?',
      cards: [
        {
          title: 'Pixel-Perfect Color Accuracy',
          description: 'Achieve exact brand colors (HEX) without creating - critical for product catalogs and design consistency.'
        },
        {
          title: 'Material-Aware Recoloring',
          description: 'Our AI distinguishes fabric, metal, and plastic surfaces to apply color changes with appropriate texture/reflectivity for each material type.'
        },
        {
          title: 'Multiple options supported',
          description: 'You can input the Hex code accurately to obtain the desired color or make a rough selection by sliding the button. At the same time, you can provide more precise modification solutions through text descriptions or selecting our preset features.'
        }
      ]
    },
    offerMore: {
      title: 'We Offer More',
      cards: [
        {
          image: '/images/card/change_color.png',
          title: 'Image Color Changer',
          description: 'Instantly swap product or object colors with realistic results.'
        },
        {
          image: '/images/card/remove_bg.png',
          title: 'Image Background Remover',
          description: 'Instantly cut out subjects and get a clean, transparent PNG in seconds.'
        },
        {
          image: '/images/card/change_bg.png',
          title: 'Image Background Changer',
          description: 'Replace any background with custom colors, images, or scenes.'
        },
        {
          image: '/images/card/upscale.png',
          title: 'Image Enhancer',
          description: 'Boost image resolution up to 2× without losing sharpness or detail.'
        },
        {
          image: '/marketing/images/card/partial_mod.png',
          title: 'AI Image Changer',
          description: 'Edit or replace only the areas you select, keeping the rest untouched.'
        },
        {
          image: '/marketing/images/card/virtual_try.png',
          title: 'AI Virtual Try-On',
          description: 'Generate lifelike model images wearing your products, cutting shoot costs and boosting sales.'
        },
        {
          image: '/images/card/design.png',
          title: 'AI Outfit Generator',
          description: 'Generate and customize fashion outfits — swap fabrics, tweak styles, redesign patterns, all in one tool.'
        },
        {
          image: '/images/card/sketch_design.png',
          title: 'AI Sketch to Image Converter',
          description: 'Turn garment sketches into realistic images for prototyping and presentations.'
        }
      ]
    },
    faq: {
      items: [
        {
          question: 'Will the AI adjust lighting/shadow after color changes?',
          answer: "Automatically. Our system recalculates shadows/highlights based on the new color's reflectivity - no manual tweaking needed."
        },
        {
          question: 'Does it work with patterned fabrics?',
          answer: "Does it work with patterned fabrics? Yes, our AI will analyze pattern repetition and maintain design integrity, especially for clothing fabrics, which will have more detailed adjustments and outputs."
        },
        {
          question: 'Is the AI Color Changer free to use?',
          answer: 'New users receive 5 free credits to try the feature. Continued use requires purchasing credit packages, which can be done in your account dashboard.'
        },
        {
          question: 'Will the processed images be stored in my account?',
          answer: 'Yes, all edited images are saved securely in your portfolio. You can access, download, or delete them anytime via your account.'
        },
        {
          question: 'Can I change colors in specific areas only?',
          answer: 'Of course, there are multiple ways for you to choose from by entering text to tell us your specific needs or selecting the areas you need to modify in our design features.'
        },
      ]
    },
    
  },

  virtual_try: {
    id: 'virtual_try',
    name: 'AI虚拟试穿',
    heroMain: {
      title: 'AI Virtual Try-On',
      subtitle: 'Immediately imagine the fit of any clothing with realistic pose adjustments - perfect for shoppers, designers, and brands. No physical samples required.',
      mainImage: '/marketing/images/hero/virtual_try/virtuals_trye.png',
      uploadText: 'Try Now',
      uploadSubText: 'Or drop a product image or URL',
      demoImages: [
        '/marketing/images/hero/virtual_try/one.jpg',
        '/marketing/images/hero/virtual_try/two.jpg',
        '/marketing/images/hero/virtual_try/three.jpg',
        '/marketing/images/hero/virtual_try/four.jpg'
      ]
    },
    fusionGuide: {
      title: 'How to Generate Model Try-on<br/>Images From Apparel?',
      cards: [
        {
          icon: '/marketing/images/feature/picture.png',
          title: 'Upload Your Photo',
          description: 'Upload your apparel image and a target model image. For best results, use a clear, well-lit photo with visible posture.'
        },
        {
          icon: '/marketing/images/feature/water.png',
          title: 'Select Garment & Pose',
          description: 'Choose the garment category (Top/Bottom/One-Piece) and optionally upload a reference pose image for realistic adjustments.'
        },
        {
          icon: '/marketing/images/feature/download.png',
          title: 'Generate & Download',
          description: 'Get your AI-processed image in seconds, then download the high-resolution try-on result.'
        }
      ]
    },
    whyChoose: {
      title: 'Why Choose Creamoda?',
      cards: [
        {
          title: 'Realistic Fit Simulation',
          description: 'Chimer AI analyzes body shape, fabric behavior, and movement dynamics to help designers and brands simulate how garments fit, drape, and adjust across sizes and poses — enabling early design validation.'
        },
        {
          title: 'Efficient Design & Marketing Workflow',
          description: 'Skip physical fittings and costly photo shoots — generate multiple virtual try-on images in minutes for concept reviews, market testing, or e-commerce display.'
        },
        {
          title: 'End-to-End Virtual Garment Solution',
          description: 'Upload finished garments to create realistic try-on visuals. AI preserves stitching, prints, and fabric flow while adapting poses naturally, providing accurate references for prototyping, marketing, and supply chain collaboration.'
        }
      ]
    },
    offerMore: {
      title: 'We Offer More',
      cards: [
        {
          image: '/marketing/images/card/virtual_try.png',
          title: 'AI Virtual Try-On',
          description: 'Generate lifelike model images wearing your products, cutting shoot costs and boosting sales.'
        },
        {
          image: '/images/card/design.png',
          title: 'AI Outfit Generator',
          description: 'Generate and customize fashion outfits — swap fabrics, tweak styles, redesign patterns, all in one tool.'
        },
        {
          image: '/images/card/change_color.png',
          title: 'Image Color Changer',
          description: 'Instantly swap product or object colors with realistic results.'
        },
        {
          image: '/images/card/remove_bg.png',
          title: 'Image Background Remover',
          description: 'Instantly cut out subjects and get a clean, transparent PNG in seconds.'
        },
        {
          image: '/images/card/change_bg.png',
          title: 'Image Background Changer',
          description: 'Replace any background with custom colors, images, or scenes.'
        },
        {
          image: '/images/card/upscale.png',
          title: 'Image Enhancer',
          description: 'Boost image resolution up to 2× without losing sharpness or detail.'
        },
        {
          image: '/marketing/images/card/partial_mod.png',
          title: 'AI Image Changer',
          description: 'Edit or replace only the areas you select, keeping the rest untouched.'
        },
        {
          image: '/images/card/sketch_design.png',
          title: 'AI Sketch to Image Converter',
          description: 'Turn garment sketches into realistic images for prototyping and presentations.'
        }
      ]
    },
    faq: {
      items: [
        {
          question: 'Will my body measurements be stored?',
          answer: "No, measurements are only used temporarily for the fitting session. We don't store personal body data permanently."
        },
        {
          question: 'How realistic are the pose adjustments?',
          answer: 'Our AI analyzes joint angles, body proportions and fabric physics to ensure natural-looking results that maintain original lighting and shadows.'
        },
        {
          question: 'Is the AI Virtual Try-On Tool free to use?',
          answer: 'New users receive 5 free credits to try the feature. Continued use requires purchasing credit packages, which can be done in your account dashboard.'
        },
        {
          question: 'Will the processed images be stored in my account?',
          answer: 'Yes, all edited images are saved securely in your portfolio. You can access, download, or delete them anytime via your account.'
        },
        {
          question: 'Can I try on my own clothes? ',
          answer: 'Yes! Upload your full body photo and clothing image for virtual fitting. It is recommended to use a solid color background and high-definition image for the best results.'
        },
      ]
    }
  },

  outfit_generator: {
    id: 'outfit_generator',
    name: 'AI服装生成',
    heroMain: {
      title: 'AI Outfit Generator',
      subtitle: 'Turn Ideas into Art Instantly – Generate unique images from text or transform your photos with AI-powered creativity. No design skills required!',
      mainImage: '/marketing/images/hero/outfit_generator/outfit_generatorss.png',
      uploadText: 'Try Now',
      uploadSubText: 'Or drop a design reference or URL',
      demoImages: [
        '/marketing/images/hero/outfit_generator/one.png',
        '/marketing/images/hero/outfit_generator/two.png',
        '/marketing/images/hero/outfit_generator/three.png',
        '/marketing/images/hero/outfit_generator/four.jpg'
      ]
    },
    fusionGuide: {
      title: 'How to Design Fashion Items Online?',
      cards: [
        {
          icon: '/marketing/images/feature/picture.png',
          title: 'Input & Customize',
          description: 'Enter a prompt or upload a photo, then describe the desired changes or choose from the design features with multiple selections supported.'
        },
        {
          icon: '/marketing/images/feature/water.png',
          title: 'AI Processing',
          description: 'Our AI generates or transforms your image in seconds. For images, it preserves original details while applying your edits. Preview and tweak results if needed.'
        },
        {
          icon: '/marketing/images/feature/download.png',
          title: 'Download & Share',
          description: 'Download your high-resolution image. Use it directly or refine further with Creamoda’s editing tools. All outputs are saved to your portfolio for easy access.'
        }
      ]
    },
    whyChoose: {
      title: 'Why Choose Creamoda?',
      cards: [
        {
          title: 'Unlimited Creativity for Diverse Needs',
          description: 'Whether starting from nothing (Text) or enhancing existing images (Image), our AI delivers precise results for all scenarios, no matter what your needs or industry are.'
        },
        {
          title: 'Professional Results, Zero Skills Required',
          description: 'No design experience needed. Get designer-quality output through simple text or presets. AI automatically handles lighting, composition, and detail refinement.'
        },
        {
          title: 'Smart Presets for Perfect Results',
          description: 'Our curated presets handle complex parameters automatically - just pick a style and let AI do the rest.'
        }
      ]
    },
    offerMore: {
      title: 'We Offer More',
      cards: [
        {
          image: '/images/card/design.png',
          title: 'AI Outfit Generator',
          description: 'Generate and customize fashion outfits — swap fabrics, tweak styles, redesign patterns, all in one tool.'
        },
        {
          image: '/marketing/images/card/virtual_try.png',
          title: 'AI Virtual Try-On',
          description: 'Generate lifelike model images wearing your products, cutting shoot costs and boosting sales.'
        },
        {
          image: '/images/card/sketch_design.png',
          title: 'AI Sketch to Image Converter',
          description: 'Turn garment sketches into realistic images for prototyping and presentations.'
        },
        {
          image: '/images/card/change_color.png',
          title: 'Image Color Changer',
          description: 'Instantly swap product or object colors with realistic results.'
        },
        {
          image: '/images/card/remove_bg.png',
          title: 'Image Background Remover',
          description: 'Instantly cut out subjects and get a clean, transparent PNG in seconds.'
        },
        {
          image: '/images/card/change_bg.png',
          title: 'Image Background Changer',
          description: 'Replace any background with custom colors, images, or scenes.'
        },
        {
          image: '/images/card/upscale.png',
          title: 'Image Enhancer',
          description: 'Boost image resolution up to 2× without losing sharpness or detail.'
        },
        {
          image: '/marketing/images/card/partial_mod.png',
          title: 'AI Image Changer',
          description: 'Edit or replace only the areas you select, keeping the rest untouched.'
        }
      ]
    },
    faq: {
      items: [
        {
          question: 'Why does my output sometimes differ from my prompt?',
          answer: 'AI interprets creatively. For closer matches, add more specific keywords or choose one or more of the design features we have pre-set that best meet your needs.'
        },
        {
          question: 'How does AI prioritize when both text and image inputs are provided?',
          answer: 'AI integrates these two types of inputs: your image settings are basic, while text prompts refine details, so for optimal results, use clear instructions such as "Keep the bottoms the same as the original image, but change long sleeves to short sleeves.'
        },
        {
          question: 'Is the AI Image Generator free to use?',
          answer: 'New users receive 5 free credits to try the feature. Continued use requires purchasing credit packages, which can be done in your account dashboard.'
        },
        {
          question: 'Will the processed images be stored in my account?',
          answer: 'Yes, all edited images are saved securely in your portfolio. You can access, download, or delete them anytime via your account.'
        },
        {
          question: 'Can I use text prompts and image uploads together?',
          answer: 'Yes! For text to image, you can output text and select our preset models and output formats for combination, and the image to image function supports uploading images and adding text prompts for combination editing. There are multiple ways for you to choose from, just to output the results that satisfy you the most.'
        }
      ]
    }
  },


  sketch_convert: {
    id: 'sketch_convert',
    name: 'AI草图转图片',
    heroMain: {
      title: 'AI Sketch to Image Converter',
      subtitle: 'Upload your hand drawing and let AI convert it into a production-ready design - with textures, colors, and clean lines automatically applied.',
      mainImage: '/marketing/images/hero/sketch_convert/sketch_convert.png',
      uploadText: 'Try Now',
      uploadSubText: 'Or drop a sketch image or URL',
      demoImages: [
        '/marketing/images/hero/sketch_convert/one.png',
        '/marketing/images/hero/sketch_convert/two.png',
        '/marketing/images/hero/sketch_convert/three.png',
        '/marketing/images/hero/sketch_convert/four.png'
      ]
    },
    fusionGuide: {
      title: 'How to Tranfrom Sketch Images<br/>to Real Design?',
      cards: [
        {
          icon: '/marketing/images/feature/picture.png',
          title: 'Upload Sketch',
          description: 'Upload a hand-drawn sketch (JPEG/PNG) or URL. For best results, use clear lines and minimal shadows.'
        },
        {
          icon: '/marketing/images/feature/water.png',
          title: 'Describe Your Design',
          description: 'Type text prompts (e.g., "silk evening gown with floral embroidery") or select our preset design features, supports multi-selection for complex designs.'
        },
        {
          icon: '/marketing/images/feature/download.png',
          title: 'Generate & Download',
          description: 'AI processes your inputs and generates a polished design in seconds, then downloads as PNG.'
        }
      ]
    },
    whyChoose: {
      title: 'Why Choose Creamoda?',
      cards: [
        {
          title: 'Intelligent Draft Optimization',
          description: 'Our AI will automatically correct shaky lines and smooth curves while maintaining the authenticity of hand drawn artwork'
        },
        {
          title: 'AI-Powered Material Autofill',
          description: 'Automatically detects garment components (collars, sleeves, etc.) and applies physically accurate fabric textures with proper draping, stitching, and lighting effects. AI intelligently matches materials to design intent (e.g., silk for eveningwear, denim for casual).'
        },
        {
          title: 'AI Material Mapping',
          description: 'Automatically analyzes sketch contours and assigns physically accurate fabric properties with realistic textures, draping, and lighting effects.'
        }
      ]
    },
    offerMore: {
      title: 'We Offer More',
      cards: [
        {
          image: '/images/card/sketch_design.png',
          title: 'AI Sketch to Image Converter',
          description: 'Turn garment sketches into realistic images for prototyping and presentations.'
        },
        {
          image: '/images/card/design.png',
          title: 'AI Outfit Generator',
          description: 'Generate and customize fashion outfits — swap fabrics, tweak styles, redesign patterns, all in one tool.'
        },
        {
          image: '/images/card/upscale.png',
          title: 'Image Enhancer',
          description: 'Boost image resolution up to 2× without losing sharpness or detail.'
        },
        {
          image: '/images/card/remove_bg.png',
          title: 'Image Background Remover',
          description: 'Instantly cut out subjects and get a clean, transparent PNG in seconds.'
        },
        {
          image: '/images/card/change_bg.png',
          title: 'Image Background Changer',
          description: 'Replace any background with custom colors, images, or scenes.'
        },
        {
          image: '/images/card/change_color.png',
          title: 'Image Color Changer',
          description: 'Instantly swap product or object colors with realistic results.'
        },
        {
          image: '/marketing/images/card/virtual_try.png',
          title: 'AI Virtual Try-On',
          description: 'Generate lifelike model images wearing your products, cutting shoot costs and boosting sales.'
        },
        {
          image: '/marketing/images/card/partial_mod.png',
          title: 'AI Image Changer',
          description: 'Edit or replace only the areas you select, keeping the rest untouched.'
        }
      ]
    },
    faq: {
      items: [
        {
          question: 'Can I specify a style for the final design output?',
          answer: 'Absolutely! You can select from preset styles (e.g., "Y2K", "Cyberpunk") or describe your desired style in text. The AI will adapt its output accordingly.'
        },
        {
          question: 'Can I edit the AI-generated designs afterwards?',
          answer: "Yes! All outputs can be further refined using Creamoda's full suite of design tools, including color changes and detail adjustments."
        },
        {
          question: 'Is the AI Sketch Converter free to use?',
          answer: 'New users receive 5 free credits to try the feature. Continued use requires purchasing credit packages, which can be done in your account dashboard.'
        },
        {
          question: 'Will the processed images be stored in my account?',
          answer: 'Yes, all edited images are saved securely in your portfolio. You can access, download, or delete them anytime via your account.'
        },
        {
          question: 'How accurate is the AI in interpreting rough sketches?',
          answer: 'Our AI is trained to understand fashion sketches - it can interpret rough outlines into polished designs while preserving your original creative intent. For complex details, we recommend adding brief text descriptions.'
        },
      ]
    }
  },

  partial_modify: {
    id: 'partial_modify',
    name: 'AI局部编辑',
    heroMain: {
      title: 'AI Image Changer',
      subtitle: 'Modify only what you need—AI handles the rest with pixel-perfect precision.',
      mainImage: '/marketing/images/hero/changer/changer.png',
      uploadText: 'Try Now',
      uploadSubText: 'Or drop a file, paste image or URL',
      demoImages: [
        '/marketing/images/hero/changer/one.png',
        '/marketing/images/hero/changer/two.png',
        '/marketing/images/hero/changer/three.png',
        '/marketing/images/hero/changer/four.png'
      ]
    },
    fusionGuide: {
      title: 'How to Change Images Easily<br/>With One Click?',
      cards: [
        {
          icon: '/marketing/images/feature/picture.png',
          title: 'Upload & Describe ',
          description: 'Edits Upload image (JPEG/PNG) and specify changes (e.g., "change shirt to T-shirt")'
        },
        {
          icon: '/marketing/images/feature/water.png',
          title: 'AI Precision Processing',
          description: 'AI applies context-aware edits while keeping unmodified areas intact.'
        },
        {
          icon: '/marketing/images/feature/download.png',
          title: 'Download & Compare',
          description: 'Save modified PNGs for comparison or final use.'
        }
      ]
    },
    whyChoose: {
      title: 'Why Choose Creamoda?',
      cards: [
        {
          title: 'AI-Powered Detail Preservation',
          description: 'Our AI detects and protects intricate details like stitching patterns, embroidery threads and fabric weaves during modifications-no more blurred logos or distorted textures.'
        },
        {
          title: 'Multi-Object Simultaneous Editing',
          description: "Edit multiple independent elements in one operation (e.g., change all buttons' color while removing collar tags simultaneously) with separate control for each element."
        },
        {
          title: 'Multiple options supported',
          description: 'You can provide more precise modification solutions through text descriptions or selecting our preset features, support multiple selection.'
        }
      ]
    },
    offerMore: {
      title: 'We Offer More',
      cards: [
        {
          image: '/marketing/images/card/partial_mod.png',
          title: 'AI Image Changer',
          description: 'Edit or replace only the areas you select, keeping the rest untouched.'
        },
        {
          image: '/images/card/remove_bg.png',
          title: 'Image Background Remover',
          description: 'Instantly cut out subjects and get a clean, transparent PNG in seconds.'
        },
        {
          image: '/images/card/change_bg.png',
          title: 'Image Background Changer',
          description: 'Replace any background with custom colors, images, or scenes.'
        },
        {
          image: '/images/card/change_color.png',
          title: 'Image Color Changer',
          description: 'Instantly swap product or object colors with realistic results.'
        },
        {
          image: '/images/card/upscale.png',
          title: 'Image Enhancer',
          description: 'Boost image resolution up to 2× without losing sharpness or detail.'
        },
        {
          image: '/marketing/images/card/virtual_try.png',
          title: 'AI Virtual Try-On',
          description: 'Generate lifelike model images wearing your products, cutting shoot costs and boosting sales.'
        },
        {
          image: '/images/card/design.png',
          title: 'AI Outfit Generator',
          description: 'Generate and customize fashion outfits — swap fabrics, tweak styles, redesign patterns, all in one tool.'
        },
        {
          image: '/images/card/sketch_design.png',
          title: 'AI Sketch to Image Converter',
          description: 'Turn garment sketches into realistic images for prototyping and presentations.'
        }
      ]
    },
    faq: {
      items: [
        {
          question: 'Will AI destroy my original image after I propose modifications?',
          answer: "Of course not! Any modifications you wish to make are based on Creamoda's webpage and will not have any impact on the original images you upload from files or devices."
        },
        {
          question: 'How do you maintain fabric sheen and lighting when changing material types?',
          answer: "Material lighting engine analyzes fiber reflectivity. When changing fabrics, it automatically adjusts highlights/shadows to match the new material's light response."
        },
        {
          question: 'Is the AI Image Changer free to use?',
          answer: 'New users receive 5 free credits to try the feature. Continued use requires purchasing credit packages, which can be done in your account dashboard.'
        },
        {
          question: 'Will the processed images be stored in my account?',
          answer: 'Yes, all edited images are saved securely in your portfolio. You can access, download, or delete them anytime via your account.'
        },
        {
          question: 'Can I modify multiple parts of an image at once?',
          answer: 'Of course, you can show us the final image you want to obtain through text description, or you can choose our preset design features, supporting multiple selections.'
        }
      ]
    }
  },

  free_nano_banana: {
    id: 'free_nano_banana',
    name: 'AI纳米香蕉设计器',
    heroMain: {
      title: 'Free Nano-Banana Generator',
      subtitle: 'Discover Google’s Gemini 2.5 Flash Image, and see how it powers next-generation fashion design.',
      mainImage: '/marketing/images/hero/banana/banana.png',
      uploadText: 'Try Now',
      uploadSubText: 'Or drop a banana sketch, paste banana URL',
      demoImages: [
        '/marketing/images/hero/banana/one.png',
        '/marketing/images/hero/banana/two.png',
        '/marketing/images/hero/banana/three.png',
        '/marketing/images/hero/banana/four.png'
      ]
    },
    fusionGuide: {
      title: 'How to Generate Fashion Images<br/>with Free Nano-Banana?',
      cards: [
        {
          icon: '/marketing/images/feature/picture.png',
          title: 'Visit Outfit Generator Feature',
          description: 'Access our Free Nano-Banana integration and explore pre-built templates tailored for fashion design and creative testing.'
        },
        {
          icon: '/marketing/images/feature/water.png',
          title: 'Enter Your Prompt',
          description: 'Describe your fashion idea — from outfit style and fabric to mood and background — and let AI interpret it.'
        },
        {
          icon: '/marketing/images/feature/download.png',
          title: 'Generate & Export Instantly',
          description: 'Receive high-quality visuals in seconds and download them for prototyping, presentations, or campaigns.'
        }
      ]
    },
    whyChoose: {
      title: 'Why Choose Creamoda?',
      cards: [
        {
          title: 'Seamless Integration',
          description: "Unlike standalone demos, Creamoda integrates Google's Gemini 2.5 Flash Image directly into a complete design workflow for apparel brands and designers."
        },
        {
          title: 'Fashion-Focused Features',
          description: 'Beyond image generation, our platform supports outfit variation, virtual try-on, and sketch-to-image workflows tailored to fashion.'
        },
        {
          title: 'Scalable for Business',
          description: "From solo designers to global brands, we provide credit-based flexibility to fit your growth."
        }
      ]
    },
    offerMore: {
      title: 'We Offer More',
      cards: [
        {
          image: '/images/card/remove_bg.png',
          title: 'Nano Banana Background Remover',
          description: 'Isolate your nano bananas from any background with atomic-level precision.'
        },
        {
          image: '/images/card/change_bg.png',
          title: 'Micro Environment Changer',
          description: 'Place your nano bananas in exotic micro-environments like inside raindrops or on butterfly wings.'
        },
        {
          image: '/images/card/upscale.png',
          title: 'Nano Banana Enhancer',
          description: 'Enhance nano banana resolution up to quantum clarity without losing microscopic detail.'
        },
        {
          image: '/marketing/images/card/partial_mod.png',
          title: 'Selective Nano Editor',
          description: 'Edit individual nano banana segments - adjust peel thickness, add micro-spots, or modify curvature.'
        },
        {
          image: '/images/card/change_color.png',
          title: 'Nano Banana Colorizer',
          description: 'Transform your nano bananas into rainbow variants, metallic finishes, or translucent crystal bananas.'
        },
        {
          image: '/marketing/images/card/virtual_try.png',
          title: 'Virtual Nano Try-On',
          description: 'See how nano bananas look when integrated into clothing fibers or accessories.'
        },
        {
          image: '/images/card/design.png',
          title: 'Nano Fashion Generator',
          description: 'Generate complete nano-banana-inspired fashion items and micro-textile patterns.'
        },
        {
          image: '/images/card/sketch_design.png',
          title: 'Banana Sketch to Nano',
          description: 'Convert hand-drawn banana sketches into precise nano-scale 3D models.'
        }
      ]
    },
    faq: {
      items: [
        {
          question: 'What is Nano-Banana?',
          answer: 'Nano-Banana is Google’s latest image model, known for high-quality, efficient image generation across creative tasks.'
        },
        {
          question: 'How does Creamoda use Nano-Banana?',
          answer: 'We integrate the model into our fashion design suite, enabling designers to generate outfits, fabrics, and marketing visuals with speed and accuracy.'
        },
        {
          question: 'Do I need technical skills to use it?',
          answer: 'No — our interface is designed for creative professionals. Simply upload sketches or ideas, and let AI handle the generation.'
        },
        {
          question: 'Is Nano-Banana free to use in Creamoda?',
          answer: 'We offer free credits for new users, after which you can purchase credit packages for extended use.'
        },
        {
          question: 'Can I use these AI-generated designs commercially?',
          answer: 'Yes, designs generated with Creamoda can be used for design development, marketing, and client presentations, subject to our licensing terms.'
        }
      ]
    }
  },

  design_page: {
    id: 'design_page',
    name: 'Design Hub',
    heroMain: {
      title: 'Design Hub',
      subtitle: 'Explore our comprehensive design tools and create stunning fashion designs with AI-powered solutions.',
      mainImage: '/marketing/images/hero/design/design_hub.png',
      uploadText: 'Get Started',
      uploadSubText: 'Start designing with our powerful tools',
      demoImages: [
        '/marketing/images/hero/design/demo1.png',
        '/marketing/images/hero/design/demo2.png',
        '/marketing/images/hero/design/demo3.png',
        '/marketing/images/hero/design/demo4.png'
      ]
    },
    fusionGuide: {
      title: 'How to Use Our Design Tools?',
      cards: [
        {
          icon: '/marketing/images/feature/picture.png',
          title: 'Choose Your Tool',
          description: 'Select from our comprehensive suite of AI-powered design tools tailored for fashion and creative professionals.'
        },
        {
          icon: '/marketing/images/feature/water.png',
          title: 'Design & Create',
          description: 'Use intuitive interfaces and AI assistance to bring your creative vision to life with professional results.'
        },
        {
          icon: '/marketing/images/feature/download.png',
          title: 'Export & Share',
          description: 'Download high-quality results and share your creations directly from our platform.'
        }
      ]
    },
    whyChoose: {
      title: 'Why Choose Our Design Platform?',
      cards: [
        {
          title: 'Comprehensive Tool Suite',
          description: 'Access all the design tools you need in one integrated platform, from image editing to AI generation.'
        },
        {
          title: 'AI-Powered Innovation',
          description: 'Leverage cutting-edge AI technology to enhance your creative process and achieve professional results faster.'
        },
        {
          title: 'User-Friendly Interface',
          description: 'Intuitive design makes our tools accessible to both beginners and professionals, no technical skills required.'
        }
      ]
    },
    offerMore: {
      title: 'Explore Our Design Tools',
      cards: [
        {
          image: '/images/card/design.png',
          title: 'AI Outfit Generator',
          description: 'Generate and customize fashion outfits — swap fabrics, tweak styles, redesign patterns, all in one tool.'
        },
        {
          image: '/marketing/images/card/virtual_try.png',
          title: 'AI Virtual Try-On',
          description: 'Generate lifelike model images wearing your products, cutting shoot costs and boosting sales.'
        },
        {
          image: '/images/card/remove_bg.png',
          title: 'Magic Kit Tools',
          description: 'Professional image editing tools including background removal, color changing, and image enhancement.'
        },
        {
          image: '/images/card/change_bg.png',
          title: 'Background Editor',
          description: 'Replace any background with custom colors, images, or scenes using AI technology.'
        },
        {
          image: '/images/card/upscale.png',
          title: 'Image Enhancer',
          description: 'Boost image resolution up to 2× without losing sharpness or detail.'
        },
        {
          image: '/images/card/change_color.png',
          title: 'Color Changer',
          description: 'Instantly swap product or object colors with realistic results.'
        },
        {
          image: '/images/card/sketch_design.png',
          title: 'Sketch to Image',
          description: 'Turn garment sketches into realistic images for prototyping and presentations.'
        },
        {
          image: '/marketing/images/card/partial_mod.png',
          title: 'AI Image Editor',
          description: 'Edit or replace only the areas you select, keeping the rest untouched.'
        }
      ]
    },
    faq: {
      items: [
        {
          question: 'What design tools are available?',
          answer: 'Our platform includes AI outfit generation, virtual try-on, background editing, image enhancement, and many more creative tools.'
        },
        {
          question: 'Do I need design experience?',
          answer: 'No, our tools are designed for users of all skill levels. The AI-powered interface makes professional design accessible to everyone.'
        },
        {
          question: 'Can I use designs commercially?',
          answer: 'Yes, designs created with our tools can be used for commercial purposes according to our licensing terms.'
        },
        {
          question: 'How do I get started?',
          answer: 'Simply choose a tool that fits your needs and start creating. Most tools offer free trials to help you get started.'
        }
      ]
    }
  },
  
};

export const getTheme = (themeId: string): ThemeConfig => {
  return themes[themeId] || themes.background_remove;
};

export const getAllThemes = (): ThemeConfig[] => {
  return Object.values(themes);
}; 