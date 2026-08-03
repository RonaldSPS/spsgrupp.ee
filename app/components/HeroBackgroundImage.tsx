import Image from "next/image"

type Props = {
  src: string
  alt?: string
  preload?: boolean
  objectPosition?: string
}

export default function HeroBackgroundImage({
  src,
  alt = "",
  preload = false,
  objectPosition = "center",
}: Props) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      preload={preload}
      className="object-cover z-0"
      style={{ objectPosition }}
      sizes="100vw"
    />
  )
}
