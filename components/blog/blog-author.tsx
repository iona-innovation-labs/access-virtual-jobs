import Image from "next/image";
import Link from "next/link";
import { BlogAuthor as BlogAuthorType } from "@/types/blog";
import { Twitter, Linkedin, Github } from "lucide-react";

interface BlogAuthorProps {
  author: BlogAuthorType;
  showBio?: boolean;
  className?: string;
}

export function BlogAuthor({
  author,
  showBio = false,
  className = "",
}: BlogAuthorProps) {
  return (
    <div className={`flex items-start gap-4 ${className}`}>
      <div className="relative h-12 w-12 overflow-hidden rounded-full">
        <Image
          src={author.avatar}
          alt={author.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-foreground">{author.name}</h4>
          <span className="text-sm text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">{author.role}</span>
        </div>

        {showBio && author.bio && (
          <p className="mt-1 text-sm text-muted-foreground">{author.bio}</p>
        )}

        {author.social && (
          <div className="mt-2 flex items-center gap-3">
            {author.social.twitter && (
              <Link
                href={`https://twitter.com/${author.social.twitter.replace("@", "")}`}
                className="text-muted-foreground hover:text-brand transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-4 w-4" />
              </Link>
            )}
            {author.social.linkedin && (
              <Link
                href={`https://linkedin.com/${author.social.linkedin}`}
                className="text-muted-foreground hover:text-brand transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
            )}
            {author.social.github && (
              <Link
                href={`https://github.com/${author.social.github}`}
                className="text-muted-foreground hover:text-brand transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
