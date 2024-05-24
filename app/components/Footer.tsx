// Copyright (c) 2024, Circle Technologies, LLC. All rights reserved.
//
// SPDX-License-Identifier: Apache-2.0
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Typography } from "@mui/joy";
import Link from "next/link";

export const Footer = () => (
  <footer className='absolute bottom-0 flex flex-col lg:flex-row w-screen justify-between p-4 lg:items-center gap-y-2'>
    <Typography className='text-neutral-600 text-xs'>
      © 2024 Circle Technology Services, LLC. All rights reserved.
    </Typography>

    <span className='space-x-4 font-semibold'>
      <Link
        href='https://www.circle.com/en/legal/privacy-policy'
        target='_blank'
        className='text-xs no-underline'
      >
        Privacy Policy
      </Link>

      <Link
        href='https://www.circle.com/en/legal/acceptable-use-policy'
        target='_blank'
        className='text-xs no-underline'
      >
        Acceptable Use
      </Link>

      <Link
        href='https://www.circle.com/en/legal/cookie-policy'
        target='_blank'
        className='text-xs no-underline'
      >
        Cookie Policy
      </Link>
    </span>
  </footer>
);
