import Link from 'next/link'
import Image from 'next/image'

interface ServiceCardProps {
  id: string
  name: string
  description: string | null
  image: string | null
  comingSoon?: boolean
}

export default function ServiceCard({ id, name, description, image, comingSoon = false }: ServiceCardProps) {
  const baseClasses = "flex relative bg-white dark:bg-zinc-900 rounded-xl border border-zinc-300 dark:border-zinc-800 shadow-md transition-all w-full"
  const interactiveClasses = comingSoon
    ? "opacity-70 cursor-not-allowed"
    : "group hover:shadow-lg hover:scale-101 cursor-pointer"

  const content = (
    <div className="flex w-full">
      <div className="flex items-center justify-center p-2">
        {image && (
          <Image
            src={image}
            alt={name}
            width={100}
            height={100}
            className={comingSoon ? "opacity-50" : ""}
            loading="eager"
            unoptimized
          />
        )}
      </div>
      <div className="p-3">
        <div className="flex items-center gap-2 mb-1 relative">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            {name}
          </h2>
          {/* {comingSoon && (
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full whitespace-nowrap absolute -top-5 -right-1">
              Próximamente
            </span>
          )} */}
        </div>
        <p className="text-base leading-none text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  )

  if (comingSoon) {
    return (
      <div className={`${baseClasses} ${interactiveClasses}`}>
        {content}
      </div>
    )
  }

  return (
    <Link
      href={`/servicios/${id}/reservar`}
      className={`${baseClasses} ${interactiveClasses}`}
    >
      {content}
    </Link>
  )
}
