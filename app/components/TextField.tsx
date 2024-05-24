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

import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  InputProps,
} from "@mui/joy";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { forwardRef } from "react";

export interface TextFieldProps extends InputProps {
  label?: string;
  helperText?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, helperText, ...props }, ref) => {
    return (
      <FormControl id={props.id} error={props.error} className='w-full'>
        <FormLabel className='text-sm'>{label}</FormLabel>
        <Input className='text-lg' ref={ref} size='lg' {...props} />
        <FormHelperText>
          {props.error && (
            <InformationCircleIcon width={20} className='text-red' />
          )}
          {helperText}
        </FormHelperText>
      </FormControl>
    );
  },
);

TextField.displayName = "TextField";
